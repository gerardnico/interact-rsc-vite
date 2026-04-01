import path from "node:path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import pageModulesPlugin from "../../pages/viteVirtualPagesModules.js";
import viteReloadOnConfChange from "../../config/viteReloadOnConfChange.js";
import viteImageService from "../../images/imageViteDevMiddleware.js";
import type {InlineConfig} from "vite";
import viteSsgPlugin from "../../static-generation/vite-ssg-plugin.js";

import {imageEndPointEnvName, imageSecretEnvName, imageViteOutDirEnvName} from "../../images/imageMiddlewareHandler.js";
import viteComponentProvider from "../../componentsProvider/viteVirtualComponentProviders.js";
import svgReactPlugin from "vite-plugin-svgr";
import Inspect from 'vite-plugin-inspect'
import viteStylingOutlineNumberingPlugin from "../../styles/viteStylingOutlineNumbering.js";
import {viteMiddlewareRegistry} from "../../middlewareEngine/viteMiddlewareRegistry.js";
import {
    componentsProviderModuleName,
    createMarkdownConfig,
    getMarkdownConfig,
    setMarkdownConfigGlobally
} from "../../markdown/conf/markdownConfig.js";
// interactConfig should be a relative path and not the package.json export as this is used by the client
import {createInteractConfig} from "../../config/interactConfigHandler.js";
import viteLayoutProvider from "../../componentsProvider/viteVirtualLayoutProviders.js";
import tailwindcss from "@tailwindcss/vite"
import viteStylingGlobalStylesheet from "../../styles/viteStylingGlobalStylesheet.js";
import {getInteractConfig, setInteractConfigGlobally} from "../../config/interactConfig.js";


export type InteractCommand = 'start' | 'build' | 'preview';
type LogLevel = 'info' | 'warn' | 'error' | 'silent';
type InteractConfig = {
    confPath?: string,
    command?: InteractCommand;
    port?: number,
    outDir?: string;
    logLevel?: LogLevel;
};

/**
 * Globals Conf are set and reused in each plugin
 * Why? If they change, we set them, and we restart the dev server
 */
export async function setGlobalsConf(confPath: string | undefined, force: boolean = false) {
    const interactConfigTyped = createInteractConfig(confPath);
    setInteractConfigGlobally(interactConfigTyped, force);
    const markdownConfig = await createMarkdownConfig()
    setMarkdownConfigGlobally(markdownConfig, force)
}


export async function resolveViteConfig(
    {
        confPath,
        port,
        command
    }: InteractConfig): Promise<InlineConfig> {

    /**
     * Set the globals config
     */
    await setGlobalsConf(confPath)

    /**
     * Use them
     */
    let interactConfigTyped = getInteractConfig();

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
            alias: {},
            // Trying to avoid hooks fatal error, already done by plugin-react
            // https://github.com/vitejs/vite/blob/f09299ce13b55d51456985b96d4c3b3a1f131acb/packages/plugin-react/src/index.ts#L339
            // does not work because of @base-ui/react
            dedupe: ['react', 'react-dom', '@base-ui/react', 'lucide-react', '@vitejs/plugin-react', '@vitejs/plugin-rsc', '@babel', 'rsc-html-stream', 'class-variance-authority', 'clsx']
        },
        // https://vite.dev/config/shared-options#publicdir
        publicDir: interactConfigTyped.paths.publicDirectory,
        // https://vite.dev/config/shared-options#cachedir
        cacheDir: path.resolve(interactConfigTyped.paths.cacheDirectory, ".vite"),
        build: {
            // https://vite.dev/config/build-options#build-outdir
            outDir: interactConfigTyped.paths.buildDirectory,
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
                            index: path.resolve(interactConfigTyped.paths.resourcesDirectory, 'rsc/server/entry.rsc.tsx'),
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
                            index: path.resolve(interactConfigTyped.paths.resourcesDirectory, 'rsc/server/entry.ssr.tsx'),
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
                            index: path.resolve(interactConfigTyped.paths.resourcesDirectory, 'rsc/browser/entry.browser.tsx'),
                        }
                    },
                    outDir: path.resolve(interactConfigTyped.paths.buildDirectory, "client"),
                    emptyOutDir: true
                },
            },
        },
        plugins: [
            // Resolve the @/ in a cascading way
            // {
            //     enforce: "pre", // should be first
            //     ...viteAtSrcAliasResolution(),
            // },
            viteImageService({
                baseDir: interactConfigTyped.paths.imagesDirectory,
                cacheDir: command === 'start' ? undefined : path.resolve(cachePath, "img"),
                secret: process.env[imageSecretEnvName],
                resourcesDir: interactConfigTyped.paths.resourcesDirectory,
                endPoint: imageMiddlewareEndPoint
            }),
            // https://mdxjs.com/packages/mdx/#processoroptions
            mdx(getMarkdownConfig().getMdxRollupConfig(command)),
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
            viteReloadOnConfChange(),
            // Component provider (provide the MdxComponent for mdx)
            viteComponentProvider({moduleName: componentsProviderModuleName}),
            // Layout provider (provide the layouts dynamically)
            viteLayoutProvider(),
            // Pages (after layout)
            pageModulesPlugin(['mdx', 'tsx', 'jsx']),
            viteStylingGlobalStylesheet(),
            viteStylingOutlineNumberingPlugin(),
            {
                enforce: "post", // runs after as we depend on the component plugin
                ...viteMiddlewareRegistry()
            },
            // Rsc
            // At the end because the client entry import the virtual CSS (outline and global)
            // Note: you can use vite-plugin-inspect (https://github.com/antfu-collective/vite-plugin-inspect)
            // to understand how "use client" and "use server" directives are transformed internally.
            Inspect(),
            rsc(),
            viteSsgPlugin(),
        ],
    }
}
