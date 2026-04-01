import type {Plugin, ResolvedConfig} from "vite";
import path from "node:path";
import {pathToFileURL} from "node:url";
import fs from "node:fs";
import {Readable} from "node:stream";
// interactConfig should be a relative path and not the package.json export as this is used by the client
import {getInteractConfig} from "../config/interactConfig.js";
import {defaultComponentsValue} from "../config/interactConfigHandler.js";

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
    // @ts-ignore - error TS6142: Module 'entry.rsc.js' was resolved to entry.rsc.tsx', but '--jsx' is not set.
    const entryRscModule: typeof import('../../resources/rsc/server/entry.rsc.tsx') = await import(/* @vite-ignore */ pathToFileURL(rscIndexFilePath).href)

    // entry provides a list of static paths
    const staticPaths = entryRscModule.getStaticPaths()
    // render rsc and html
    let clientEnv = config.environments['client'];
    if (!clientEnv) {
        throw new Error("The client env environment does not exist.");
    }
    const baseDir = clientEnv.build.outDir
    /**
     * Add the 404 if not set
     */
    const interactConfig = getInteractConfig();
    if (interactConfig.components?.NotFound?.importPath == defaultComponentsValue.NotFound?.importPath) {
        // 404 is the default for GitHub
        // https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site
        staticPaths.push("/404");
    }
    for (const staticPatch of staticPaths) {
        config.logger.info('[vite-rsc:ssg] -> ' + staticPatch)
        let fakeRequest = new Request(new URL(staticPatch, 'http://ssg.local'));
        const {html, rsc} = await entryRscModule.handleSsg(fakeRequest)
        await writeFileStream(
            path.join(baseDir, normalizeHtmlFilePath(staticPatch)),
            html,
        )
        await writeFileStream(path.join(baseDir, staticPatch + RSC_POSTFIX), rsc)
    }
}

async function writeFileStream(filePath: string, stream: ReadableStream) {
    await fs.promises.mkdir(path.dirname(filePath), {recursive: true})
    await fs.promises.writeFile(filePath, Readable.fromWeb(stream as any))
}

function normalizeHtmlFilePath(p: string) {
    if (p.endsWith('/')) {
        return p + 'index.html'
    }
    return p + '.html'
}