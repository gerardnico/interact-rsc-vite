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
import viteImageService from "../../vite/image-service/vite-image-service";
import configHandler from "../../config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const interactPackageDir = path.resolve(__dirname, '../..');

export default class Start extends Command {
    static description = 'Start Development server'

    static flags = {
        root: Flags.string({
            description: 'Project root directory',
            default: "",
        }),
        // https://vite.dev/guide/assets#the-public-directory
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
        const {flags} = await this.parse(Start)

        let rootPath = path.resolve(flags.root)

        let pagesDir = flags.pagesDir

        let interactConfig = new configHandler(
            {
                rootPath,
                pagesDir
            })
            .getConfig();


        let publicDir;
        if (!flags.publicDir.startsWith("/")) {
            publicDir = path.resolve(rootPath, flags.publicDir);
        } else {
            publicDir = path.resolve(flags.publicDir);
        }
        // https://vite.dev/guide/build#public-base-path
        let publicBasePath = ""


        /**
         * For runtime, I see also: './node_modules/.xxx'
         * dist does not work as it will be cleaned up
         */
        let runtimePath = path.resolve(rootPath, ".interact");
        let cachePath = path.resolve(runtimePath, ".interact/cache")


        // Note: You can merge also
        // https://vite.dev/guide/api-javascript#mergeconfig
        let outDistDir = path.resolve(rootPath, "dist");
        const config: InlineConfig = {
            root: rootPath,
            base: publicBasePath,
            server: {
                port: flags.port,
            },
            publicDir: publicDir,
            build: {
                // https://rollupjs.org/configuration-options/
                rollupOptions: {
                    external: [
                        // Ensure image service dependency (present in our vite-image-service.ts file)
                        // such as sharp, mime and etag is excluded from bundling
                        // https://sharp.pixelplumbing.com/install/#vite
                        "sharp",
                        "mime",
                        "etag"
                    ]
                },
                // https://vite.dev/config/build-options#build-outdir
                outDir: outDistDir
            },
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
                confModulePlugin(interactConfig),
                viteImageService({
                    baseDir: path.resolve(rootPath, "img"),
                    cacheDir: path.resolve(cachePath, "img"),
                })
            ],
        }


        const server = await createServer(config)
        await server.listen()
        // port may change
        // ie Port 5173 is in use, trying another one...
        this.log(`Starting Interact Dev server`)
        server.printUrls()

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