import path from "node:path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import pageModulesPlugin from "../../pages/viteVirtualPagesModules.js";
import viteReloadOnConfChange from "../../config/viteReloadOnConfChange.js";
import viteImageService from "../../images/imageViteDevMiddleware.js";
import type {InlineConfig} from "vite";
import viteSsgPlugin from "../../rsc/static-generation/vite-ssg-plugin.js";

import {imageEndPointEnvName, imageSecretEnvName, imageViteOutDirEnvName} from "../../images/imageMiddlewareHandler.js";
import viteComponentProvider from "../../componentsProvider/viteVirtualComponentProviders.js";
import svgReactPlugin from "vite-plugin-svgr";
import viteOutlineNumberingStylesPlugin from "../../styling/viteOutlineNumberingStyleProvider.js";
import {viteMiddlewareRegistry} from "../../middlewareEngine/viteMiddlewareRegistry.js";
import {createMarkdownConfig, setMarkdownConfigGlobally} from "../../markdown/conf/markdownConfig.js";
// interactConfig should be a relative path and not the package.json export as this is used by the client
import {createInteractConfig, setInteractConfigGlobally} from "../../config/interactConfig.js";
import viteLayoutProvider from "../../componentsProvider/viteVirtualLayoutProviders.js";
import tailwindcss from "@tailwindcss/vite"


export type InteractCommand = 'start' | 'build' | 'preview';
type LogLevel = 'info' | 'warn' | 'error' | 'silent';
type InteractConfig = {
    confPath?: string,
    command?: InteractCommand;
    port?: number,
    outDir?: string;
    logLevel?: LogLevel;
};


export async function resolveViteConfig(
    {
        confPath,
        port,
        command
    }: InteractConfig): Promise<InlineConfig> {


    const interactConfigTyped = createInteractConfig(confPath);
    setInteractConfigGlobally(interactConfigTyped);

    // https://vite.dev/guide/build#public-base-path
    let publicBasePath = interactConfigTyped.site.base;

    let cachePath = path.resolve(interactConfigTyped.paths.cacheDirectory, "cache")

    /**
     * Use to generate image into the static build
     */
    process.env[imageViteOutDirEnvName] = interactConfigTyped.paths.buildDirectory;

    /**
     * Used to generate the URL in dev
     * The endpoint of the local service endpoint ("/_images")
     */
    let imageMiddlewareEndPoint = "/_images";
    process.env[imageEndPointEnvName] = imageMiddlewareEndPoint

    /**
     * The components provider name
     * (for mdx and layout)
     */
    const componentsProviderModuleName = "interact:components"

    /**
     * Markdown Config with a
     */
    const markdownConfig = await createMarkdownConfig({
        componentsProviderModuleName: componentsProviderModuleName,
        interactConfig: interactConfigTyped
    })
    setMarkdownConfigGlobally(markdownConfig)

    return {
        mode: command == "build" ? "production" : "development",
        logLevel: 'info', // or 'warn' — try 'info' first
        root: interactConfigTyped.paths.rootDirectory,
        base: publicBasePath,
        server: {
            port: port,
        },
        resolve: {
            /**
             * Order of precedence
             * By default, tsc compilation writes the js file next to the ts file
             * Works only without extension in the import
             */
            extensions: ['.ts', '.tsx', '.mts', '.jsx', '.js', '.mjs'],
            // https://vite.dev/config/shared-options#resolve-alias
            // When aliasing to file system paths, always use absolute paths.
            alias: {
                // shadcn alias
                // https://ui.shadcn.com/docs/installation/vite#update-viteconfigts
                "@": path.resolve(interactConfigTyped.paths.rootDirectory, "./src"),
            }
        },
        // https://vite.dev/config/shared-options#publicdir
        publicDir: interactConfigTyped.paths.publicDirectory,
        // https://vite.dev/config/shared-options#cachedir
        cacheDir: path.resolve(interactConfigTyped.paths.cacheDirectory, ".vite"),
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
            outDir: interactConfigTyped.paths.buildDirectory
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
                            index: path.resolve(interactConfigTyped.paths.srcDirectory, 'rsc/server/entry.rsc.js'),
                        },
                    },
                    outDir: path.resolve(interactConfigTyped.paths.buildDirectory, "rsc"),
                    emptyOutDir: true
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
                            index: path.resolve(interactConfigTyped.paths.srcDirectory, 'rsc/server/entry.ssr.js'),
                        },
                    },
                    outDir: path.resolve(interactConfigTyped.paths.buildDirectory, "ssr"),
                    emptyOutDir: true
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
                            index: path.resolve(interactConfigTyped.paths.srcDirectory, 'rsc/browser/entry.browser.js'),
                        },
                    },
                    outDir: path.resolve(interactConfigTyped.paths.buildDirectory, "client"),
                    emptyOutDir: true
                },
            },
        },
        plugins: [
            pageModulesPlugin(interactConfigTyped.paths.pagesDirectory, ['mdx', 'tsx', 'jsx']),
            viteImageService({
                baseDir: interactConfigTyped.paths.imagesDirectory,
                cacheDir: command === 'start' ? undefined : path.resolve(cachePath, "img"),
                secret: process.env[imageSecretEnvName],
                endPoint: imageMiddlewareEndPoint
            }),
            viteReloadOnConfChange(interactConfigTyped),
            // Component provider (provide also the MdxComponent for mdx)
            viteComponentProvider({moduleName: componentsProviderModuleName, interactConfig: interactConfigTyped}),
            // Layout provider (provide the layouts dynamically)
            viteLayoutProvider({interactConfig: interactConfigTyped}),
            // https://mdxjs.com/packages/mdx/#processoroptions
            mdx(markdownConfig.getMdxRollupConfig(command)),
            react(),
            // Tailwind
            tailwindcss(),
            // https://www.npmjs.com/package/vite-plugin-svgr
            svgReactPlugin({
                // If the content needs to be imported as string add the `?raw` property
                include: '**/*.svg',
                svgrOptions: {
                    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
                    svgoConfig: {
                        plugins: ['preset-default', 'removeTitle', 'removeDesc', 'removeDoctype', 'cleanupIds'],
                    },
                },
            }),
            viteOutlineNumberingStylesPlugin(interactConfigTyped),
            {
                enforce: "post", // runs after as we depend on the component plugin
                ...viteMiddlewareRegistry(
                    interactConfigTyped,
                    [
                        ...interactConfigTyped.pages.providers || [],
                        {
                            importPath: path.resolve(interactConfigTyped.paths.srcDirectory, 'middleware/localPagesMiddleware.js'),
                            props: {
                                pagesDirectory: interactConfigTyped.paths.pagesDirectory
                            }
                        }]
                )
            },
            // Rsc
            // At the end because the client import the outline numbering CSS virtual vite module
            // Note: you can use vite-plugin-inspect (https://github.com/antfu-collective/vite-plugin-inspect)
            // to understand how "use client" and "use server" directives are transformed internally.
            // import("vite-plugin-inspect").then(m => m.default()),
            rsc(),
            viteSsgPlugin(),
        ],
    }
}
