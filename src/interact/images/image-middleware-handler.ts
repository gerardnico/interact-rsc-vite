import path from "node:path";
import {z} from "zod";
import fsPromises from "fs/promises";
import fs from "fs";
import etag from "etag";
import sharp, {type FormatEnum} from "sharp";
import {getPresetOptions, ImageCompressionSchema} from "./image-compression-type";
import {verifyUrlAndDeleteVerificationProperties} from "./url-signature";
import crypto from "crypto";
import * as mime from "mrmime";
import {ImageDimensionHelper} from "./image-dimension-helper";
import {fileURLToPath} from "node:url";
import {dirname, join} from "path";
import {optimize} from 'svgo';

const __dirname = dirname(fileURLToPath(import.meta.url));

function hash(input: crypto.BinaryLike) {
    return crypto.createHash("sha1").update(input).digest("hex");
}

class ImageHandlerError extends Error {
    message: string;
    statusCode: number;
    errorName: string | undefined;

    constructor(message: string, statusCode: number, errorName?: string) {
        super(message);
        this.name = 'AppError';
        this.message = message;
        this.statusCode = statusCode;
        this.errorName = errorName;
    }
}


function getFormatFromAcceptHeader(req: Request, sourceFile: string): keyof FormatEnum {

    const accept = req.headers.get('accept') || "";

    // Example of Accept header for chrome
    // image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8
    // Avif first, webp is supported
    if (accept.includes("image/avif")) return "avif";
    if (accept.includes("image/webp")) return "webp";

    const original = path.extname(sourceFile).replace(".", "");
    return original as keyof FormatEnum;
}

export function createImageHandler(config: { baseDir: string, cacheDir: string, endPoint: string; secret: string }) {
    const {endPoint, secret, cacheDir, baseDir} = config;

    const widthSchema = z.coerce.number().int().positive().describe("A image width should have a positive integer value").nullable();
    const heightSchema = z.coerce.number().int().positive().describe("A image height should have a positive integer value").nullable();
    const fallBackSvgString = fs.readFileSync(join(__dirname, 'broken-heart-landscape.svg'), 'utf-8');

    return async function (req: Request): Promise<Response> {


        const url = new URL(req.url, "http://localhost");

        function getRequestedWith() {
            let urlWidth = url.searchParams.get("width") || url.searchParams.get("w");
            try {
                return widthSchema.parse(urlWidth);
            } catch (e) {
                throw new ImageHandlerError(`bad width value ${urlWidth}: ${e}`, 400, "Bad width requested");
            }
        }

        function getRequestedImagePath() {
            if (!url.pathname) {
                throw new ImageHandlerError(`Missing path`, 400, "The path is missing")
            }
            if (!url.pathname.startsWith(endPoint)) {
                throw new ImageHandlerError(`Path does not start with end point ${endPoint}`, 500)
            }
            return url.pathname.substring(endPoint.length + 1); // +1 to delete the root separator
        }

        function getRequestedHeight() {
            const rawHeight = url.searchParams.get("height") || url.searchParams.get("h");
            try {
                return heightSchema.parse(rawHeight);
            } catch (e) {
                throw new ImageHandlerError(`bad height value ${rawHeight}: ${e}`, 400, 'Bad height requested');
            }
        }


        /**
         * Convert 16:9, ... to a float
         * @returns The ratio as a float
         * @throws Error if the ratio string is invalid
         */
        function getRequestedRatio(): number | null {
            const stringRatio = url.searchParams.get('ratio') || url.searchParams.get('r');
            if (!stringRatio) {
                return null;
            }
            const [widthStr, heightStr] = stringRatio.split(":", 2);

            const width = parseInt(widthStr, 10);
            if (isNaN(width)) {
                throw new ImageHandlerError(
                    `The width value (${widthStr}) of the ratio \`${stringRatio}\` is not numeric`,
                    400,
                    'Bad ratio requested (width)'
                );
            }

            const height = parseInt(heightStr, 10);
            if (isNaN(height)) {
                throw new ImageHandlerError(
                    `The height value (${heightStr}) of the ratio \`${stringRatio}\` is not numeric`,
                    400,
                    'Bad ratio requested (height)'
                );
            }

            if (height === 0) {
                throw new ImageHandlerError(
                    `The height value of the ratio \`${stringRatio}\` should not be zero`,
                    400,
                    'Bad ratio requested (height)'
                );
            }

            return width / height;
        }

        function getCompression() {
            const compressionRawValue = (url.searchParams.get("compression") || url.searchParams.get('c')) || 'high';
            try {
                return ImageCompressionSchema.parse(compressionRawValue);
            } catch (e) {
                throw new ImageHandlerError(`bad compression value ${compressionRawValue}: ${e}`, 400, 'Bad compression requested');
            }
        }

        function getRequestFormat(requestedImgPath: string): [keyof FormatEnum, string] {
            const requestedFormat = (url.searchParams.get("format") || url.searchParams.get("f")) as keyof FormatEnum || getFormatFromAcceptHeader(req, requestedImgPath);
            const contentType = mime.lookup(requestedFormat);
            if (!contentType) {
                throw new ImageHandlerError(`Unknown type for format ${requestedFormat}`, 400, "Format unsupported");
            }
            return [requestedFormat, contentType];
        }

        try {

            verifyUrlAndDeleteVerificationProperties(url, secret)

            const requestedImgPath = getRequestedImagePath()
            const requestedWidth = getRequestedWith()
            const requestedHeight = getRequestedHeight()
            const requestedRatio = getRequestedRatio();
            const requestedCompression = getCompression();
            const [requestedFormat, httpHeaderContentType] = getRequestFormat(requestedImgPath);

            /**
             * Cache
             */
            const cacheKey = hash(requestedImgPath + url.searchParams.toString());
            const cachedFile = path.join(cacheDir, `${cacheKey}.${requestedFormat}`);
            try {

                const cached = await fsPromises.readFile(cachedFile);
                let etagValue = etag(cached);
                let headers = {
                    'Content-Type': httpHeaderContentType,
                    "Cache-Control": "public, max-age=31536000, immutable",
                    "ETag": etagValue
                };
                if (req.headers.get("if-none-match") === etagValue) {

                    return new Response(null, {
                        status: 304,
                        headers: headers
                    })

                }
                return new Response(cached, {
                    headers: headers
                });
            } catch {
            }

            const sourceFile = path.resolve(baseDir, requestedImgPath);
            let sharpPipeline = sharp(sourceFile);

            const {width: intrinsicWidth, height: intrinsicHeight} = await sharpPipeline.metadata();

            const dimensionHelper = new ImageDimensionHelper({
                requestedWidth,
                requestedHeight,
                requestedRatio,
                intrinsicHeight,
                intrinsicWidth
            })
            let [targetWidth, targetHeight] = dimensionHelper.getTargetDimensions();

            sharpPipeline = sharpPipeline.resize({
                width: targetWidth,
                height: targetHeight,
                withoutEnlargement: true,
            });

            const options = getPresetOptions({preset: requestedCompression, format: requestedFormat});
            sharpPipeline.toFormat(requestedFormat, options)
            const buffer = await sharpPipeline.toBuffer();
            await fsPromises.writeFile(cachedFile, buffer);

            return new Response(new Uint8Array(buffer), {
                headers: {
                    "Content-Type": httpHeaderContentType,
                    "Cache-Control": "public, max-age=31536000, immutable",
                    "ETag": etag(buffer)
                }
            })
        } catch (err) {

            let status = 500
            let message = String(err)
            let name;
            if (err instanceof ImageHandlerError) {
                message = err.message;    // 'Unauthorized'
                status = err.statusCode;
                name = err.name;
            }

            let responseFallBackSvgString = fallBackSvgString;

            /**
             * Error title
             */
                // File existing is done via sharp
            let missingInputFile = "Input file is missing";
            if (message.includes(missingInputFile)) {
                name = "Image not found";
            }
            if (name) {
                responseFallBackSvgString = responseFallBackSvgString.replace("ERR_IMAGE_LOAD", name.toUpperCase())
            }

            try {
                const requestedWith = getRequestedWith()
                responseFallBackSvgString = optimize(responseFallBackSvgString, {
                    plugins: [
                        {
                            name: 'addAttributesToSVGElement',
                            params: {attributes: [{width: `${requestedWith}`}]}
                        }
                    ]
                }).data;
            } catch (e) {
                // the error is on the width
            }

            return new Response(responseFallBackSvgString, {
                status: status,
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'X-Interact-Image-Handler-Error': message
                }
            })
        }
    }
}