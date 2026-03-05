import path from "node:path";

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
import {
    castHeightToNumber,
    castRatioToNumber,
    castWidthToNumber, urlKeyCompressionProperty,
    urlKeyErrorProperty, urlKeyFormatProperty, urlKeyHeightProperty, urlKeyRatioProperty,
    urlKeyWidthProperty,
} from "./image-shared";
import {ImageError, ImageErrors} from "./image-errors-dictionary";

const __dirname = dirname(fileURLToPath(import.meta.url));

function hash(input: crypto.BinaryLike) {
    return crypto.createHash("sha1").update(input).digest("hex");
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


    const fallBackSvgString = fs.readFileSync(join(__dirname, 'broken-heart-landscape.svg'), 'utf-8');

    return async function (req: Request): Promise<Response> {


        const url = new URL(req.url, "http://localhost");

        function getRequestedWith() {
            let urlWidth = url.searchParams.get(urlKeyWidthProperty) || url.searchParams.get("w");
            return castWidthToNumber(urlWidth);
        }

        function getRequestedImagePath() {
            if (!url.pathname) {
                throw new ImageError({message: "The path is missing", ...ImageErrors.SRC_MISSING})
            }
            if (!url.pathname.startsWith(endPoint)) {
                throw new ImageError({message: `Path does not start with end point ${endPoint}`, ...ImageErrors.INTERNAL_ERROR})
            }
            return url.pathname.substring(endPoint.length + 1); // +1 to delete the root separator
        }

        function getRequestedHeight() {
            const rawHeight = url.searchParams.get(urlKeyHeightProperty) || url.searchParams.get("h");
            return castHeightToNumber(rawHeight);
        }


        function getCompression() {
            const compressionRawValue = (url.searchParams.get(urlKeyCompressionProperty) || url.searchParams.get('c')) || 'high';
            try {
                return ImageCompressionSchema.parse(compressionRawValue);
            } catch (e) {
                throw new ImageError({message: `bad compression value ${compressionRawValue}: ${e}`, ...ImageErrors.BAD_COMPRESSION});
            }
        }

        function getRequestFormat(requestedImgPath: string): [keyof FormatEnum, string] {
            const requestedFormat = (url.searchParams.get(urlKeyFormatProperty) || url.searchParams.get("f")) as keyof FormatEnum || getFormatFromAcceptHeader(req, requestedImgPath);
            const contentType = mime.lookup(requestedFormat);
            if (!contentType) {
                throw new ImageError({message: `Unknown type for format ${requestedFormat}`, ...ImageErrors.FORMAT_UNSUPPORTED});
            }
            return [requestedFormat, contentType];
        }

        let error = url.searchParams.get(urlKeyErrorProperty);
        let isBrokenImageRequestFromImageComponent = error!=null;
        try {

            verifyUrlAndDeleteVerificationProperties(url, secret)

            /**
             * Broken image requested
             */

            if (error) {
                for (const imageError of Object.values(ImageErrors)) {
                    if (String(imageError.code) == error) {
                        // noinspection ExceptionCaughtLocallyJS
                        throw new ImageError(imageError);
                    }
                }
            }

            /**
             * Normal request
             */
            const requestedImgPath = getRequestedImagePath()
            const requestedWidth = getRequestedWith()
            const requestedHeight = getRequestedHeight()
            const stringRatio = url.searchParams.get(urlKeyRatioProperty) || url.searchParams.get('r');
            const requestedRatio = castRatioToNumber(stringRatio);
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
            let title;
            if (err instanceof ImageError) {
                message = err.message;
                status = err.status || 500;
                title = err.title;
            }

            let responseFallBackSvgString = fallBackSvgString;

            /**
             * Error title
             * Note: File existing error is thrown by sharp
             */
            let missingInputFile = "Input file is missing";
            if (message.includes(missingInputFile)) {
                title = "Image not found";
            }
            if (title) {
                responseFallBackSvgString = responseFallBackSvgString.replace("{ERR_TITLE}", title.toUpperCase())
            }

            /**
             * isBrokenImageRequest
             */
            let messageProvenance
            if(isBrokenImageRequestFromImageComponent) {
                messageProvenance = "IMAGE ELEMENT";
            } else {
                messageProvenance = "REQUEST";
            }
            responseFallBackSvgString = responseFallBackSvgString.replace("{ERR_PROVENANCE}", messageProvenance)

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