import fs from "fs/promises";
import type {Plugin} from 'vite';
/**
 * Used by vite rsc to convert the
 */
import {toNodeHandler} from 'srvx/node'
import {createImageHandler} from "./imageMiddlewareHandler.js";

type ImageViteDevMiddleware = {
    baseDir?: string,
    cacheDir?: string,
    endPoint?: string,
    // the directory of the resources (ie broken image)
    resourcesDir: string,
    // if local there is no need to sign the URL
    secret?: string
};
export default function viteImageService({
                                             baseDir = "img",
                                             cacheDir = ".cache/images",
                                             endPoint = "/_images",
                                             resourcesDir,
                                             secret
                                         }: ImageViteDevMiddleware): Plugin {

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
                    let handler = createImageHandler({
                        baseDir, cacheDir, endPoint, resourcesDir, secret
                    })
                    await toNodeHandler(handler)(req as any, res as any)
                } catch (err) {
                    next(err)
                }
            });
        },
    };
}