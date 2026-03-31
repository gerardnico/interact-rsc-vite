import path from "node:path";

import fsPromises from "fs/promises";
import fs from "fs";
import etag from "etag";
import sharp, {type FormatEnum} from "sharp";
import {ImageCompressionSchema} from "./imageCompressionType.js";
import {verifyUrlAndDeleteVerificationProperties} from "./urlSignature.js";
import crypto from "crypto";
import * as mime from "mrmime";
import {ImageDimensionHelper} from "./imageDimensionHelper.js";
import {optimize} from 'svgo';
import {
    brokenImage,
    castFit,
    castHeightToNumber,
    castRatioToNumber,
    castWidthToNumber, processImageWithSharp, urlKeyCompressionProperty,
    urlKeyErrorProperty, urlKeyFitProperty, urlKeyFormatProperty, urlKeyHeightProperty, urlKeyRatioProperty,
    urlKeyWidthProperty,
} from "./imageSharedCode.js";
import {ImageError, ImageErrors} from "./imageErrorsDictionary.js";


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


type ImageHandlerProps = {
    // where to find the images
    baseDir: string,
    // where to cache the images
    cacheDir?: string,
    // the directory of the resources (ie image)
    resourcesDir: string,
    // the http endpoint
    endPoint: string;
    // if the service is running locally, there is no need to sign the URL and secret can be empty
    secret?: string
};

export function createImageHandler(config: ImageHandlerProps) {
    const {endPoint, secret, cacheDir, resourcesDir, baseDir} = config;


    const fallBackSvgString = fs.readFileSync(path.resolve(resourcesDir, "images", brokenImage), 'utf-8');

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
                throw new ImageError({message: `Unknown type for format ${requestedFormat}`, ...ImageErrors.UNKNOWN_TYPE});
            }
            return [requestedFormat, contentType];
        }

        let error = url.searchParams.get(urlKeyErrorProperty);
        let isBrokenImageRequestFromImageComponent = url.searchParams.has(urlKeyErrorProperty);
        try {

            if (secret) {
                verifyUrlAndDeleteVerificationProperties(url, secret)
            }

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
                // unknown/undefined
                // noinspection ExceptionCaughtLocallyJS
                throw new ImageError(ImageErrors.INTERNAL_ERROR);
            }

            /**
             * Normal request
             */
            const requestedImgPath = getRequestedImagePath()
            const requestedWidth = getRequestedWith()
            const requestedHeight = getRequestedHeight()
            const stringRatio = url.searchParams.get(urlKeyRatioProperty) || url.searchParams.get('r');
            const requestedRatio = castRatioToNumber(stringRatio);
            const requestedFit = castFit(url.searchParams.get(urlKeyFitProperty));
            const requestedCompression = getCompression();
            let [requestedFormat, httpHeaderContentType] = getRequestFormat(requestedImgPath);

            /**
             * Cache
             */
            let cachedFile
            if (cacheDir) {
                const cacheKey = hash(requestedImgPath + url.searchParams.toString());
                cachedFile = path.join(cacheDir, `${cacheKey}.${requestedFormat}`);
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
            }

            const sourceFile = path.resolve(baseDir, requestedImgPath);
            const metadata = await sharp(sourceFile).metadata();
            const {width: intrinsicWidth, height: intrinsicHeight} = metadata;

            const dimensionHelper = new ImageDimensionHelper({
                requestedWidth,
                requestedHeight,
                requestedRatio,
                intrinsicHeight,
                intrinsicWidth
            })
            let {targetWidth, targetHeight} = dimensionHelper.getTargetDimensions();
            const sharpPipeline = sharp(sourceFile)
            const finalImage = await processImageWithSharp({
                    sharpPipeline,
                    targetWidth,
                    targetHeight,
                    requestedFit,
                    requestedFormat,
                    requestedCompression
                }
            );

            if (cachedFile) {
                await fsPromises.writeFile(cachedFile, finalImage);
            }

            return new Response(new Uint8Array(finalImage), {
                headers: {
                    "Content-Type": httpHeaderContentType,
                    "Cache-Control": "public, max-age=31536000, immutable",
                    "ETag": etag(finalImage)
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
            if (isBrokenImageRequestFromImageComponent) {
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

/**
 * Env name
 */
export const imageEndPointEnvName = 'INTERACT_IMAGE_ENPOINT'
export const imageViteOutDirEnvName = 'VITE_OUT_DIR'
export const imageSecretEnvName = 'INTERACT_IMAGE_SECRET'