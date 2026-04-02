import fs from "fs/promises";
import type {Plugin} from 'vite';
/**
 * Used by vite rsc to convert the
 */
import {toNodeHandler} from 'srvx/node'
import {createImageHandler, imageSecretEnvName} from "../images/imageMiddlewareHandler.js";
import {imageEndPointEnvName, imageViteOutDirEnvName} from "../images/imageMiddlewareHandler.js";
import {getInteractConfig} from "../config/interactConfig.js";
import path from "node:path";

type ImageMiddleware = {
    command: string | undefined;
};
export default function viteImageService({
                                             command
                                         }: ImageMiddleware): Plugin {

    let interactConfig = getInteractConfig()
    let baseDir = interactConfig.paths.imagesDirectory;
    let cacheDir = command === 'start' ? undefined : path.resolve(interactConfig.paths.cacheDirectory, "img");
    // if local there is no need to sign the URL
    let secret = process.env[imageSecretEnvName];
    // the directory of the resources (ie broken image)
    let resourcesDir = interactConfig.paths.interactResourcesDirectory;


    /**
     * Use to generate image into the static build
     */
    process.env[imageViteOutDirEnvName] = interactConfig.paths.buildDirectory;

    let endPoint = "/_images";
    process.env[imageEndPointEnvName] = endPoint


    async function ensureCache() {
        if (cacheDir == null) {
            return;
        }
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