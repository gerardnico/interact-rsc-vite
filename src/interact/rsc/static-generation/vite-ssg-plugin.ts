import type {Plugin, ResolvedConfig} from "vite";
import path from "node:path";
import {pathToFileURL} from "node:url";
import fs from "node:fs";
import {Readable} from "node:stream";

const RSC_POSTFIX = '_.rsc'

export default function viteSsgPlugin(): Plugin[] {
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
    /**
     * Import the created rsc build
     */
    const rscIndexFilePath = path.join(config.environments.rsc.build.outDir, 'index.js')
    const entryRscModule: typeof import('../server/entry.rsc') = await import(pathToFileURL(rscIndexFilePath).href)

    // entry provides a list of static paths
    const staticPaths = entryRscModule.getStaticPaths()
    // render rsc and html
    const baseDir = config.environments.client.build.outDir
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