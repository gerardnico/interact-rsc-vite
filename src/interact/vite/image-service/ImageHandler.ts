import path from "node:path";
import {z} from "zod";
import fs from "fs/promises";
import etag from "etag";
import sharp, {type FormatEnum} from "sharp";
import {getPresetOptions, ImageQualityPresetSchema} from "./image-quality-preset";
import {verifyUrlAndDeleteVerificationProperties} from "./UrlSignature";
import crypto from "crypto";
import * as mime from "mrmime";
import {ImageDimensionHelper} from "./ImageDimensionHelper";


function hash(input: crypto.BinaryLike) {
    return crypto.createHash("sha1").update(input).digest("hex");
}

/**
 * Convert 16:9, ... to a float
 * @param stringRatio - The ratio string to convert (e.g. "16:9")
 * @returns The ratio as a float
 * @throws Error if the ratio string is invalid
 */
function convertTextualRatioToNumber(stringRatio: string): number {
    const [widthStr, heightStr] = stringRatio.split(":", 2);

    const width = parseInt(widthStr, 10);
    if (isNaN(width)) {
        throw new Error(
            `The width value (${widthStr}) of the ratio \`${stringRatio}\` is not numeric`
        );
    }

    const height = parseInt(heightStr, 10);
    if (isNaN(height)) {
        throw new Error(
            `The height value (${heightStr}) of the ratio \`${stringRatio}\` is not numeric`
        );
    }

    if (height === 0) {
        throw new Error(
            `The height value of the ratio \`${stringRatio}\` should not be zero`
        );
    }

    return width / height;
}

function getFormatFromAcceptHeader(req: Request, sourceFile: string): keyof FormatEnum {

    const accept = req.headers.get('accept') || "";

    // Example of Accept header for chrome
    // image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8
    // avif first, webp is supported
    if (accept.includes("image/avif")) return "avif";
    if (accept.includes("image/webp")) return "webp";

    const original = path.extname(sourceFile).replace(".", "");
    return original as keyof FormatEnum;
}

export function createImageHandler(config: { baseDir: string, cacheDir: string, endPoint: string; secret: string }) {
    const {endPoint, secret, cacheDir, baseDir} = config;

    const widthSchema = z.coerce.number().int().positive().describe("A image width should have a positive integer value").nullable();
    const heightSchema = z.coerce.number().int().positive().describe("A image height should have a positive integer value").nullable();

    return async function (req: Request): Promise<Response> {


        try {

            const url = new URL(req.url, "http://localhost");

            verifyUrlAndDeleteVerificationProperties(url, secret)

            if (!url.pathname) {
                return new Response(`Missing path`, {
                    status: 400
                })
            }
            if (!url.pathname.startsWith(endPoint)) {
                return new Response(`Path does not start with end point ${endPoint}`, {
                    status: 500
                })
            }
            const imgPath = url.pathname.substring(endPoint.length + 1); // +1 to delete the root separator

            /**
             * Url does not have the signing and expiration
             */
            const cacheKey = hash(imgPath + url.searchParams.toString());


            const requestedFormat = url.searchParams.get("f") as keyof FormatEnum || getFormatFromAcceptHeader(req, imgPath);

            let requestedWidth
            let urlWidth = url.searchParams.get("width") || url.searchParams.get("w");
            try {
                requestedWidth = widthSchema.parse(urlWidth);
            } catch (e) {
                return new Response(`bad width value ${urlWidth}: ${e}`, {
                        status: 400
                    }
                );
            }

            const rawHeight = url.searchParams.get("height") || url.searchParams.get("h");
            let requestedHeight;
            try {
                requestedHeight = heightSchema.parse(rawHeight);
            } catch (e) {
                return new Response(`bad height value ${rawHeight}: ${e}`, {
                    status: 400
                });
            }

            const rawRatio = url.searchParams.get('ratio') || url.searchParams.get('r');
            let requestedRatio = null
            if (rawRatio) {
                try {
                    requestedRatio = convertTextualRatioToNumber(rawRatio);
                } catch (e) {
                    return new Response(`bad ratio value ${rawRatio}: ${e}`, {
                        status: 400
                    });
                }
            }


            const qualityRawValue = (url.searchParams.get("quality") || url.searchParams.get('q')) || 'high';
            let requestedQualityPreset;
            try {
                requestedQualityPreset = ImageQualityPresetSchema.parse(qualityRawValue);
            } catch (e) {
                return new Response(`bad quality value ${qualityRawValue}: ${e}`, {
                    status: 400
                });
            }


            const cachedFile = path.join(cacheDir, `${cacheKey}.${requestedFormat}`);

            let contentType = mime.lookup(requestedFormat);
            if (!contentType) {
                return new Response(`Unknown type for format ${requestedFormat}`,
                    {
                        status: 400,
                    });
            }
            // serve cached
            try {

                const cached = await fs.readFile(cachedFile);
                let etagValue = etag(cached);
                let headers = {
                    'Content-Type': contentType,
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

            const sourceFile = path.resolve(baseDir, imgPath);
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

            const options = getPresetOptions({preset: requestedQualityPreset, format: requestedFormat});
            sharpPipeline.toFormat(requestedFormat, options)
            const buffer = await sharpPipeline.toBuffer();
            await fs.writeFile(cachedFile, buffer);

            return new Response(new Uint8Array(buffer), {
                headers: {
                    "Content-Type": contentType,
                    "Cache-Control": "public, max-age=31536000, immutable",
                    "ETag": etag(buffer)
                }
            })
        } catch (err) {
            console.error(err);
            return new Response(`Image processing error: ${err}`, {
                    status: 500,
                }
            )
        }
    }
}