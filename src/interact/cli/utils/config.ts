import configHandler from "../../config";
import path from "node:path";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkMdxToc from "@altano/remark-mdx-toc-with-slugs";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import pageModulesPlugin from "../../vite-page-modules/vite-plugin-page-modules";
import confModulePlugin from "../../vite-conf-module/vite-conf-module";
import viteImageService from "../../vite/image-service/vite-image-service";
import {fileURLToPath} from "node:url";
import type {InlineConfig} from "vite";
import viteRscSsgPlugin from "../../vite-rsc-ssg/vite-rsc-ssg-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Directory of the code
 */
const interactPackageDir = path.resolve(__dirname, '../..');

type InteractConfig = { rootPath: string, port?: number };

export function resolveInteractConfig({rootPath, port}: InteractConfig) {

    let imageMiddlewareEndPoint = "/_images";
    let interactConfig = new configHandler(
        {
            rootPath,
            imageEndpoint: imageMiddlewareEndPoint,
        })
        .getConfig();


    // https://vite.dev/guide/build#public-base-path
    let publicBasePath = ""

    /**
     * For runtime, I see also: './node_modules/.xxx'
     * dist does not work as it will be cleaned up
     */
    let runtimePath = path.resolve(rootPath, ".interact");
    let cachePath = path.resolve(runtimePath, "cache")


    // Note: You can merge also
    // https://vite.dev/guide/api-javascript#mergeconfig
    let outDistDir = path.resolve(rootPath, "dist");
    process.env.VITE_OUT_DIR = outDistDir

    return {
        logLevel: 'info', // or 'warn' — try 'info' first
        root: rootPath,
        base: publicBasePath,
        server: {
            port: port,
        },
        define: {
            __OUT_DIR__: JSON.stringify(outDistDir)
        },
        publicDir: interactConfig.public.publicDirectory,
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
        // specify entry point for each environment.
        environments: {
            // `rsc` environment loads modules with `react-server` condition.
            // this environment is responsible for:
            // - RSC stream serialization (React VDOM -> RSC stream)
            // - server functions handling
            rsc: {
                build: {
                    rollupOptions: {
                        input: {
                            index: path.resolve(interactPackageDir, 'vite-rsc/server/entry.rsc.tsx'),
                        },
                    },
                },
            },

            // `ssr` environment loads modules without `react-server` condition.
            // this environment is responsible for:
            // - RSC stream deserialization (RSC stream -> React VDOM)
            // - traditional SSR (React VDOM -> HTML string/stream)
            ssr: {
                build: {
                    rollupOptions: {
                        input: {
                            index: path.resolve(interactPackageDir, 'vite-rsc/server/entry.ssr.tsx'),
                        },
                    },
                },
            },

            // client environment is used for hydration and client-side rendering
            // this environment is responsible for:
            // - RSC stream deserialization (RSC stream -> React VDOM)
            // - traditional CSR (React VDOM -> Browser DOM tree mount/hydration)
            // - refetch and re-render RSC
            // - calling server functions
            client: {
                build: {
                    rollupOptions: {
                        input: {
                            index: path.resolve(interactPackageDir, 'vite-rsc/browser/entry.browser.tsx'),
                        },
                    },
                },
            },
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
            rsc(),
            viteRscSsgPlugin(),
            pageModulesPlugin(interactConfig.pages.pagesDirectory),
            confModulePlugin(interactConfig),
            viteImageService({
                baseDir: interactConfig.images.imagesDirectory,
                cacheDir: path.resolve(cachePath, "img"),
                secret: process.env.IMAGE_SECRET || 'secret',
                endPoint: imageMiddlewareEndPoint
            })
        ],
    } satisfies InlineConfig
}
