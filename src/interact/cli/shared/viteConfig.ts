import path from "node:path";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkMdxToc from "@altano/remark-mdx-toc-with-slugs";
import remarkGfm from 'remark-gfm';
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import pageModulesPlugin from "../../pages/viteVirtualPagesModules.js";
import viteVirtualConfModule from "../../config/viteVirtualConfModule.js";
import viteImageService from "../../images/imageViteDevMiddleware.js";
import {fileURLToPath} from "node:url";
import type {InlineConfig} from "vite";
import viteSsgPlugin from "../../rsc/static-generation/vite-ssg-plugin.js";
import {resolveInteractConfig, resolveInteractConfPath} from "../../config/configHandler.js";
import {imageEndPointEnvName, imageSecretEnvName, imageViteOutDirEnvName} from "../../images/imageMiddlewareHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Directory of the code
 */
const interactPackageDir = path.resolve(__dirname, '../..');

type InteractCommand = 'start' | 'build' | 'preview';
type InteractConfig = {
    confPath: string,
    command?: InteractCommand;
    port?: number
};

export function resolveViteConfig({confPath, port, command}: InteractConfig): InlineConfig {

    const resolvedConfPath = resolveInteractConfPath(confPath);
    const interactConfigTyped = resolveInteractConfig(resolvedConfPath);

    // https://vite.dev/guide/build#public-base-path
    let publicBasePath = ""

    /**
     * For runtime, I see also: './node_modules/.xxx'
     * dist does not work as it will be cleaned up
     */
    let runtimePath = path.resolve(resolvedConfPath.rootDirectory, ".interact");
    let cachePath = path.resolve(runtimePath, "cache")


    // Note: You can merge also
    // https://vite.dev/guide/api-javascript#mergeconfig
    let outDistDir = path.resolve(confPath, "dist");

    /**
     * Use to generate image into the static build
     */
    process.env[imageViteOutDirEnvName] = outDistDir
    /**
     * Used to generate the URL in dev
     * The endpoint of the local service endpoint ("/_images")
     */
    let imageMiddlewareEndPoint = "/_images";
    process.env[imageEndPointEnvName] = imageMiddlewareEndPoint

    return {
        logLevel: 'info', // or 'warn' — try 'info' first
        root: confPath,
        base: publicBasePath,
        server: {
            port: port,
        },
        publicDir: interactConfigTyped.paths.publicDirectory,
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
                            index: path.resolve(interactPackageDir, 'rsc/server/entry.rsc.js'),
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
                            index: path.resolve(interactPackageDir, 'rsc/server/entry.ssr.js'),
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
                            index: path.resolve(interactPackageDir, 'rsc/browser/entry.browser.js'),
                        },
                    },
                },
            },
        },
        plugins: [
            // You can use vite-plugin-inspect (https://github.com/antfu-collective/vite-plugin-inspect)
            // to understand how "use client" and "use server" directives are transformed internally.
            // import("vite-plugin-inspect").then(m => m.default()),
            rsc(),
            viteSsgPlugin(),
            pageModulesPlugin(interactConfigTyped.paths.pagesDirectory),
            viteImageService({
                baseDir: interactConfigTyped.paths.imagesDirectory,
                cacheDir: command === 'start' ? undefined : path.resolve(cachePath, "img"),
                secret: process.env[imageSecretEnvName],
                endPoint: imageMiddlewareEndPoint
            }),
            viteVirtualConfModule(resolvedConfPath),
            mdx({
                remarkPlugins: [
                    remarkFrontmatter,
                    remarkMdxFrontmatter, // exports frontmatter as `frontmatter`
                    remarkMdxToc, // exports headings as `toc`
                    remarkGfm // Table
                ],
                providerImportSource: import.meta.resolve('./mdxComponentsProvider.js')
            }),
            react(),
        ],
    }
}
