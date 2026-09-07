/**
 * The vite config.
 * For debugging purpose, a user should be able to make this config again in a standalone vite config file.
 * So make sure that the vite plugin are in vite
 */
import path from "node:path";

import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import pagesProvider from "../../vite/pagesProvider.js";
import confWatcher from "../../vite/confWatcher.js";
import imageMiddleware from "../../vite/imageMiddleware.js";
import type {InlineConfig} from "vite";
import ssg from "../../vite/ssg.js";
import mdxComponentProvider from "../../vite/mdxComponentProvider.js";
import svgReactPlugin from "vite-plugin-svgr";
import Inspect from 'vite-plugin-inspect'
import outlineNumberingStyleSheet from "../../vite/outlineNumberingStylesheet.js";
import middlewareProvider from "../../vite/middlewareProvider.js";
import layoutProvider from "../../vite/layoutProvider.js";
import headProvider from "../../vite/headProvider.js";
import tailwindcss from "@tailwindcss/vite"
import globalStylesheet from "../../vite/globalStylesheet.js";
import {setGlobalsConf} from "../../vite/globalConf.js";
import mdxRollup from "../../vite/mdxRollup.js";
import confResolved from "../../vite/confResolved.js";
import {crawlFrameworkPkgs} from "vitefu";
import {atAliasResolution} from "../../vite/atAliasResolution.js";
import type {OutputOptions} from "rollup";
import viteContextClientComponentsProvider from "../../vite/contextClientProvider.js";
import viteCheckEnvExpansion from "../../vite/viteCheckEnvExpansion.js";
import {publicHandler} from "../../vite/publicHandler.js";
import viteContextServerComponentsProvider from "../../vite/contextServerProvider.js";
import {debuglog} from "node:util";
import vitePluginPagefind from "../../vite/vite-plugin-pagefind.js";
import viteSearchProvider from "../../vite/vite-search-provider.js";


export type InteractCommand = 'start' | 'build' | 'preview';
// same log level as vite
export type LogLevel = 'info' | 'warn' | 'error' | 'silent';
type InteractConfig = {
    confPath?: string,
    command?: InteractCommand;
    port?: number,
    outDir?: string;
    logLevel?: LogLevel;
    inspect?: boolean;
};


export async function resolveViteConfig(
    {
        confPath,
        port,
        command,
        logLevel,
        inspect,
    }: InteractConfig): Promise<InlineConfig> {

    /**
     * Set the globals config
     */
    const interactConfigTyped = await setGlobalsConf(confPath)


    /**
     * In case, we get a config from the user
     */
    const viteUserConfig = {};
    /**
     * All react library that may use rsc directive (use client) needs to be processed by Vite
     * (ie needs to be in noExternal)
     * We scan the package to do that. By default, rsc vite plugin checks only that react is in peerDependencies
     * to add it
     * By default, Dependencies are "externalized" from Vite's SSR transform module system when running SSR.
     * If a dependency needs to be transformed by Vite's pipeline, they need to be added to ssr.noExternal.
     *
     * Module that should be processed by Vite: ie
     * * all react module because the RSC bundler needs to find any potential "use client" and "use server".
     * * CSS that need to be processed
     * ...
     * See why here: https://github.com/vitejs/vite-plugin-react/issues/894
     * otherwise you get: Invalid hook call due to 2 react instances
     * Adapted from https://github.com/vitejs/vite-plugin-react/issues/894#issuecomment-3368037728
     */
    const INTERACT_PKG_NAME = "@combostrap/interact";
    const reactPkgsConfig = await crawlFrameworkPkgs({
        root: interactConfigTyped.paths.nodeDirectory,
        isBuild: command === 'build',
        viteUserConfig: viteUserConfig,
        /**
         * Called first, then isFrameworkPkgByJson is called if undefined is returned
         */
        isFrameworkPkgByName(pkgName) {
            if (pkgName == INTERACT_PKG_NAME) {
                return true;
            }
            return undefined;
        },
        isFrameworkPkgByJson(pkgJson) {
            const pkgName = pkgJson['name'];
            if (['@vitejs/plugin-rsc', 'react-dom'].includes(pkgName)) {
                return
            }
            const dependencies = pkgJson['dependencies'] || [];
            const peerDependencies = pkgJson['peerDependencies'] || [];
            const reactPackage = 'react' in peerDependencies || 'react' in dependencies;
            const interactPackage = INTERACT_PKG_NAME in peerDependencies || INTERACT_PKG_NAME in dependencies;
            return peerDependencies && (reactPackage || interactPackage)
        }
    });


    const dedupe = [
        "react",
        "react-dom",
        "server-only",
        "client-only",
        "@vitejs/plugin-rsc",
        ...reactPkgsConfig.ssr.noExternal
    ]
    debuglog(`No external ${JSON.stringify(reactPkgsConfig.ssr.noExternal)}`)
    if (!reactPkgsConfig.ssr.noExternal.includes("@base-ui/react")) {
        // We check that the noExtenal arrays has base-ui to be sure that it's an interact project
        // so that we avoid:
        // TypeError: Cannot read properties of null (reading 'useRef')
        //     at exports.useRef (/home/admin/code/combostrap/interact/node_modules/react/cjs/react.production.js:523:33)
        throw new Error(`The directory ${interactConfigTyped.paths.nodeDirectory} is not interact, nor a project with a package.json that contains interact as dependencies.`)
    }

    // Hack because oclif dev.js set it
    // and need it to allow debug
    if (command === "build") {
        process.env["NODE_ENV"] = "production"
    }

    /**
     * Deadlock due to bad react import in a svgr bundle
     * We found the case where react was bundled in index.js,
     * and we then got a deadlock in a svgr module caused by
     * import { r as react_reactServerExports } from "../index.js";
     * To get the good import:
     * <code>
     * import { a as react_reactServerExports } from "./react.react-server-CTq-PDh9.js";
     * </code>
     * We have set a manual chunk to get react out of the index file
     */
    const rollupOption: OutputOptions = {
        manualChunks(id) {
            if (id.includes('node_modules/react')) {
                return 'react.react-server'; // or whatever name fits
            }
            // // Could also be one chunk per npm package ?
            // // becomes per-library cache instead of per-app-revision.
            // if (id.includes("node_modules")) {
            //     const pkg = id.match(/node_modules\/([^/]+)/)?.[1];
            //     if (pkg) return `vendor-${pkg}`;
            // }
        },
    }

    const envInteractPrefix = 'INTERACT_'

    // Force re-bundling on server start
    const forcePreBundling = command == "start";

    // The server bundles have dependency modules externalized (ie not in the bundle)
    // they therefore should be below a node_modules to resolve them
    const buildServerPath = path.resolve(interactConfigTyped.paths.nodeDirectory, "dist");

    const searchRelativeBaseUrl = ".interact/search"

    /**
     * The vite config
     */
    return {

        mode: command == "build" ? "production" : "development",
        logLevel: logLevel, // or 'warn' — try 'info' first
        // In vite, module resolution at optimization/pre-bundling phase starts always from the vite root.
        // Root is then more the module resolution start path of vite.
        // Therefore, in a global cli only/standalone project, that has no node_modules directory, we need to set it to the global cli directory.
        // We then avoid: Failed to resolve dependency: @vitejs/plugin-rsc/vendor/react-server-dom/client.browser, present in client 'optimizeDeps.include'
        // (We try to change that with a rolldown plugin unsuccessfully as they are used later after the optimization/pre-bundling phase).
        root: interactConfigTyped.paths.nodeDirectory,
        // https://vite.dev/guide/build#public-base-path
        base: interactConfigTyped.site.base,
        define: {
            __SEARCH_RELATIVE_BASE_URL__: JSON.stringify(searchRelativeBaseUrl)
        },
        server: {
            port: port,
            // for debugging: local network with host or remote with ngrok
            // host: true, // same as --host, exposes on 0.0.0.0
            allowedHosts: [".ngrok-free.app"],

            fs: {
                allow: [
                    interactConfigTyped.paths.nodeDirectory,
                    interactConfigTyped.paths.rootDirectory
                ]
            }

        },
        // if inspect is enabled
        devtools: inspect,
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
                // "react": "/home/admin/code/combostrap/interact/node_modules/react",
                // "react-dom": "/home/admin/code/combostrap/interact/node_modules/react-dom",
            },
            // Trying to avoid React hooks fatal error on client that uses the yarn portal protocol in dependencies
            // https://github.com/vitejs/vite/blob/f09299ce13b55d51456985b96d4c3b3a1f131acb/packages/plugin-react/src/index.ts#L339
            // And it works until now
            dedupe: dedupe,
        },
        // https://vite.dev/config/shared-options#publicdir
        // We implement our own
        publicDir: false,
        // https://vite.dev/config/shared-options#cachedir
        cacheDir: path.resolve(interactConfigTyped.paths.runtimeDirectory, ".vite"),
        build: {
            // for debugging ? // disables all minification including name mangling
            minify: command == "build",
            // https://vite.dev/config/build-options#build-outdir
            outDir: interactConfigTyped.paths.buildDirectory,
            sourcemap: command == "build",
        },
        // not import.meta.env.VITE_POSTHOG_API_HOST but import.meta.env.INTERACT_POSTHOG_API_HOST
        envPrefix: envInteractPrefix,
        // specify entry point for each environment.
        environments: {
            // `rsc` environment loads modules with `react-server` condition.
            // This environment is responsible for:
            // - RSC stream serialization (React VDOM -> RSC stream)
            // - server functions handling
            rsc: {
                resolve: {
                    // in the bundle
                    noExternal: [/^remark-/, /^unified/, /^mdast-/, ...reactPkgsConfig.ssr.noExternal],
                },
                build: {
                    rollupOptions: {
                        // @ts-ignore - vite vendor it, there is a path error
                        output: rollupOption,
                        // Main entry: https://rollupjs.org/configuration-options/#input
                        input: {
                            // generated as index.js
                            index: path.resolve(interactConfigTyped.paths.interactResourcesDirectory, 'rsc/server/entry.rsc.tsx'),
                        },
                    },
                    // outDir: path.resolve(interactConfigTyped.paths.buildDirectory, "rsc"),
                    outDir: path.resolve(buildServerPath, "rsc"),
                    emptyOutDir: true
                },
                optimizeDeps: {
                    force: forcePreBundling,
                }
            },

            // `ssr` environment loads modules without `react-server` condition.
            // this environment is responsible for:
            // - RSC stream deserialization (RSC stream -> React VDOM)
            // - traditional SSR (React VDOM -> HTML string/stream)
            ssr: {
                resolve: {
                    noExternal: reactPkgsConfig.ssr.noExternal,
                },
                build: {
                    rollupOptions: {
                        // @ts-ignore - vite vendor it, there is a path error
                        output: rollupOption,
                        // Main entry: https://rollupjs.org/configuration-options/#input
                        input: {
                            // generated as index.js
                            index: path.resolve(interactConfigTyped.paths.interactResourcesDirectory, 'rsc/server/entry.ssr.tsx'),
                        },
                    },
                    outDir: path.resolve(buildServerPath, "ssr"),
                    emptyOutDir: true
                },
                optimizeDeps: {
                    force: forcePreBundling,
                }
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
                        // @ts-ignore - vite vendor it, there is a path error
                        output: rollupOption,
                        // Main entry: https://rollupjs.org/configuration-options/#input
                        input: {
                            // generated as index.js
                            index: path.resolve(interactConfigTyped.paths.interactResourcesDirectory, 'rsc/browser/entry.browser.tsx'),
                        },
                        // https://rollupjs.org/configuration-options/
                        external: [
                            // Ensure image service dependency (present in our vite-image-service.ts file)
                            // such as sharp, mime and etag is excluded from bundling
                            // https://sharp.pixelplumbing.com/install/#vite
                            "sharp",
                            "mime",
                            "etag",
                            // Don't bundle node
                            /^node:/,
                            // Peer dependencies We don't have one for now
                            // import packageJson  from '../../../../package.json' with { type: 'json' };
                            // const { peerDependencies } = packageJson;
                        ]
                    },
                    outDir: path.resolve(interactConfigTyped.paths.buildDirectory, "client"),
                    emptyOutDir: true
                },
                // pre-bundling
                optimizeDeps: {
                    force: forcePreBundling,
                    exclude: ['sharp'],
                    // List of dependency not discoverable through the normal scan.
                    include: [
                        // Solution for error:
                        // use-sync-external-store/shim/index.js does not provide an export named useSyncExternalStore
                        // that is created by the response: http://localhost:5173/node_modules/@base-ui/utils/esm/store/useStore.js?v=076b4f9e
                        // it seems that vite will transform it to not be a cjs
                        // in the browser, you can see that the error comes from PageMenuButton that imports "@base-ui/react/menu"
                        "@base-ui/react/menu",
                    ]
                },
            },
        },
        // Order does not matter
        // The first request made (ie to rsc entry) will start to load the module graph
        plugins: [
            // Resolve the @/ in a cascading way
            {
                enforce: "pre", // should be first
                ...atAliasResolution(),
            },
            // Tailwind (it's an array of plugin)
            tailwindcss(),
            globalStylesheet(),
            outlineNumberingStyleSheet(),
            imageMiddleware({command: command}),
            // https://www.npmjs.com/package/vite-plugin-svgr
            svgReactPlugin({
                // If the content needs to be imported as string add the `?raw` property
                include: '**/*.svg',
                svgrOptions: {
                    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
                    svgoConfig: interactConfigTyped.svg.svgo
                },
            }),
            react(),
            confWatcher(),
            mdxRollup({command}),
            // Component provider (provide the MdxComponent for mdx)
            mdxComponentProvider(),
            // Context provider (provide the App wrapper (ie React ContextProvider))
            viteContextClientComponentsProvider(),
            viteContextServerComponentsProvider(),
            // Head provider (provide the HTML head dynamically)
            headProvider(),
            // Layout provider (provide the layouts dynamically)
            layoutProvider(),
            // Pages (after layout)
            pagesProvider(['mdx', 'tsx', 'jsx']),
            {
                enforce: "post", // runs after as we depend on the component plugin
                ...middlewareProvider()
            },
            rsc(),
            ssg(),
            viteCheckEnvExpansion(),
            // The vite-plugin-inspect (https://github.com/antfu-collective/vite-plugin-inspect)
            // to understand how "use client" and "use server" directives are transformed internally.
            inspect && Inspect(),
            logLevel == 'info' && confResolved(),
            // resources handling
            publicHandler({sourceDir: interactConfigTyped.paths.publicDirectory}),
            // site indexing
            vitePluginPagefind({siteRelativeBase: searchRelativeBaseUrl}),
            // search provider
            viteSearchProvider()
        ],
    }
}
