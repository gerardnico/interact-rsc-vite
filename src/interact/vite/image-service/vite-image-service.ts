import sharp, {type FormatEnum} from "sharp";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import mime from "mime";
import etag from "etag";
import type {Connect, Plugin} from 'vite';


function hash(input: crypto.BinaryLike) {
    return crypto.createHash("sha1").update(input).digest("hex");
}

function detectFormat(req: Connect.IncomingMessage, original: string): keyof FormatEnum {
    const accept = req.headers.accept || "";

    if (accept.includes("image/avif")) return "avif";
    if (accept.includes("image/webp")) return "webp";

    return original as keyof FormatEnum;
}

type ViteImageService = {
    baseDir?: string,
    cacheDir?: string,
    endPoint?: string
};
export default function viteImageService({
                                             baseDir = "img",
                                             cacheDir = ".cache/images",
                                             endPoint = "/_images"
                                         }: ViteImageService): Plugin {

    async function ensureCache() {
        await fs.mkdir(cacheDir, {recursive: true});
    }

    return {
        name: "interact-image-service",

        async configureServer(server) {
            await ensureCache();

            server.middlewares.use(async (req, res, next) => {

                if (!req.url?.startsWith(endPoint)) {
                    return next();
                }

                try {
                    const url = new URL(req.url, "http://localhost");

                    const imgPath = url.searchParams.get("path");
                    const width = Number(url.searchParams.get("w"));
                    const quality = Number(url.searchParams.get("q")) || 75;

                    if (!imgPath)
                        return res.end("Missing path");

                    const sourceFile = path.resolve(baseDir, imgPath);

                    const ext = path.extname(sourceFile).replace(".", "");

                    const format: keyof FormatEnum = detectFormat(req, ext);

                    const cacheKey = hash(`${imgPath}-${width}-${quality}-${format}`);

                    const cachedFile = path.join(cacheDir, `${cacheKey}.${format}`);
                    let type = mime.getType(format);
                    if (!type)
                        return res.end(`Unknown type for format ${format}`);
                    // serve cached
                    try {
                        const cached = await fs.readFile(cachedFile);

                        res.setHeader("Content-Type", type);
                        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
                        res.setHeader("ETag", etag(cached));

                        if (req.headers["if-none-match"] === etag(cached)) {
                            res.statusCode = 304;
                            return res.end();
                        }

                        return res.end(cached);
                    } catch {
                    }

                    let sharpPipeline = sharp(sourceFile);

                    if (width)
                        sharpPipeline = sharpPipeline.resize({
                            width,
                            withoutEnlargement: true,
                        });

                    sharpPipeline = sharpPipeline.toFormat(format, {quality,});

                    const buffer = await sharpPipeline.toBuffer();

                    await fs.writeFile(cachedFile, buffer);

                    res.setHeader("Content-Type", type);
                    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
                    res.setHeader("ETag", etag(buffer));

                    res.end(buffer);
                } catch (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end("Image processing error");
                }
            });
        },
    };
}