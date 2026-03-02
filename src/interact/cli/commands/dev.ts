import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import viteRscSsgPlugin from "../../vite-rsc-ssg/vite-rsc-ssg-plugin";
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
// https://github.com/altano/npm-packages/blob/main/packages/remark-mdx-toc-with-slugs/src/index.ts
import remarkMdxToc from '@altano/remark-mdx-toc-with-slugs';
import pageModulesPlugin from "../../vite-page-modules/vite-plugin-page-modules";
import confModulePlugin from "../../vite-conf-module/vite-conf-module";
import path from "node:path";
import {Command, Flags} from '@oclif/core'
import {createServer, type InlineConfig} from 'vite'

import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const interactPackageDir = path.resolve(__dirname, '../..');

export default class Dev extends Command {
    static description = 'Start Development server'

    static flags = {
        root: Flags.string({
            description: 'Project root directory',
            default: "",
        }),
        publicDir: Flags.string({
            description: 'Public assets directory',
            default: 'public',
        }),
        pagesDir: Flags.string({
            description: 'Pages directory',
            default: 'pages',
        }),
        port: Flags.integer({
            description: 'Dev server port',
            default: 5173,
        }),
    }

    async run(): Promise<void> {
        const {flags} = await this.parse(Dev)

        let rootPath = path.resolve(flags.root)
        let pagesDir
        if (!flags.pagesDir.startsWith("/")) {
            pagesDir = path.resolve(rootPath, flags.pagesDir);
        } else {
            pagesDir = path.resolve(flags.pagesDir);
        }
        let publicDir;
        if (!flags.publicDir.startsWith("/")) {
            publicDir = path.resolve(rootPath, flags.publicDir);
        } else {
            publicDir = path.resolve(flags.publicDir);
        }
        // Note: You can merge also
        // https://vite.dev/guide/api-javascript#mergeconfig
        const config: InlineConfig = {
            root: rootPath,
            server: {
                port: flags.port,
            },
            publicDir: publicDir,
            plugins: [
                // You can use vite-plugin-inspect (https://github.com/antfu-collective/vite-plugin-inspect)
                // to understand how "use client" and "use server" directives are transformed internally.
                // import("vite-plugin-inspect").then(m => m.default()),
                mdx({
                    remarkPlugins: [
                        remarkFrontmatter,
                        remarkMdxFrontmatter, // exports frontmatter as `frontmatter`
                        remarkMdxToc, // exports headings as `toc`
                    ],
                }),
                react(),
                rsc({
                    entries: {
                        client: path.resolve(interactPackageDir, 'vite-rsc/browser/entry.browser.tsx'),
                        rsc: path.resolve(interactPackageDir, 'vite-rsc/server/entry.rsc.tsx'),
                        ssr: path.resolve(interactPackageDir, 'vite-rsc/server/entry.ssr.tsx'),
                    },
                }),
                viteRscSsgPlugin(),
                pageModulesPlugin(pagesDir),
                confModulePlugin()
            ],
        }


        const server = await createServer(config)
        await server.listen()
        server.printUrls()
        this.log(`Interact Dev server started at http://localhost:${flags.port}`)
        // keep process alive + graceful shutdown
        const shutdown = async () => {
            this.log('\nShutting down Interact Dev server...')
            await server.close()
            process.exit(0)
        }

        process.on('SIGINT', shutdown)
        process.on('SIGTERM', shutdown)
    }
}