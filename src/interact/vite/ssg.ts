import type {Plugin, ResolvedConfig} from "vite";
import path from "node:path";
import {pathToFileURL} from "node:url";
import fs from "node:fs";
import {Readable} from "node:stream";
// interactConfig should be a relative path and not the package.json export as this is used by the client
import {getInteractConfig} from "../config/interactConfig.js";
import {writeFileSync} from "fs";

const RSC_POSTFIX = '_.rsc'

export default function ssg(): Plugin[] {
    return [
        {
            name: 'interact-rsc-ssg',
            config: {
                order: 'pre',
                handler(_config, env) {
                    return {
                        appType: env.isPreview ? 'mpa' : undefined,
                        rsc: {
                            serverHandler: env.isPreview ? false : undefined,
                        },
                    }
                },
            },
            buildApp: {
                async handler(builder) {
                    await renderStatic(builder.config)
                },
            },
        },
    ]
}

async function renderStatic(config: ResolvedConfig) {
    let rscEnv = config.environments['rsc'];
    if (!rscEnv) {
        throw new Error("The rsc env environment does not exist.");
    }
    console.log(`Static rendering from the rsc build located at: ${rscEnv.build.outDir}`);
    /**
     * Import the created rsc build
     */
    const rscIndexFilePath = path.join(rscEnv.build.outDir, 'index.js')
    // @ts-ignore - no jsx otherwise it will also check all resources path from the entry.rsc.tsx, we need a bundler method here
    const entryRscModule: typeof import('../../resources/rsc/server/entry.rsc.tsx') = await import(/* @vite-ignore */ pathToFileURL(rscIndexFilePath).href)

    // entry provides a list of static paths
    const staticPathsObject = entryRscModule.getStaticPaths()
    // render rsc and html
    let clientEnv = config.environments['client'];
    if (!clientEnv) {
        throw new Error("The client env environment does not exist.");
    }
    const baseDir = clientEnv.build.outDir
    let staticPaths = Object.keys(staticPathsObject)
    /**
     * Add the 404 if not set
     */
    const notFoundPath = getInteractConfig().middleware.notFoundPath;
    if (!(notFoundPath in staticPathsObject)) {
        staticPaths.push(notFoundPath)
    }

    for (const staticPatch of staticPaths) {
        config.logger.info('[vite-rsc:ssg] -> ' + staticPatch)
        let fakeRequest = new Request(new URL(staticPatch, 'http://ssg.local'));
        const {html, rsc, md} = await entryRscModule.handleSsg(fakeRequest)
        await writeFileStream(
            path.join(baseDir, normalizeFilePath(staticPatch, ".html")),
            html,
        )
        await writeFileStream(path.join(baseDir, staticPatch + RSC_POSTFIX), rsc)
        if (md != null) {
            writeFileSync(
                path.join(baseDir, normalizeFilePath(staticPatch, ".md")),
                md
            )
        }
    }
}

async function writeFileStream(filePath: string, stream: ReadableStream) {
    await fs.promises.mkdir(path.dirname(filePath), {recursive: true})
    await fs.promises.writeFile(filePath, Readable.fromWeb(stream as any))
}

function normalizeFilePath(p: string, extension: string) {
    if (p.endsWith('/')) {
        return p + 'index' + extension;
    }
    return p + extension
}