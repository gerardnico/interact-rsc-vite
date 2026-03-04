import {ImageObject} from "./ImageObject";
import path from "node:path";

import fs from "fs/promises";
import etag from "etag";
import sharp from "sharp";
import {getPresetOptions} from "./image-quality-preset";


export function createImageHandler(config: { baseDir: string, cacheDir: string, endPoint: string; secret: string }) {
    const {endPoint, secret, cacheDir, baseDir} = config;

    return async function (req: Request): Promise<Response> {


        try {

            let imageObject = new ImageObject(req, endPoint, secret);

            const cacheKey = imageObject.getCacheKey();

            let requestedFormat = imageObject.getRequestedFormat();
            const cachedFile = path.join(cacheDir, `${cacheKey}.${requestedFormat}`);
            let contentType = imageObject.getContentType();
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

            const sourceFile = path.resolve(baseDir, imageObject.getImgPath());
            let sharpPipeline = sharp(sourceFile);

            let requestedWidth = imageObject.getRequestedWidth();
            if (requestedWidth)
                sharpPipeline = sharpPipeline.resize({
                    width: requestedWidth,
                    withoutEnlargement: true,
                });

            const options = getPresetOptions({preset: imageObject.getQualityPreset(), format: requestedFormat});
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