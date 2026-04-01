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
import tailwindcss from "@tailwindcss/vite"
import globalStylesheet from "../../vite/globalStylesheet.js";
import {setGlobalsConf} from "../../vite/globalConf.js";
import mdxRollup from "../../vite/mdxRollup.js";


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

    /**
     * Set the globals config
     */
    let interactConfigTyped = await setGlobalsConf(confPath)


    return {
        mode: command == "build" ? "production" : "development",
        logLevel: 'info', // or 'warn' — try 'info' first
        root: interactConfigTyped.paths.rootDirectory,
        // https://vite.dev/guide/build#public-base-path
        base: interactConfigTyped.site.base,
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
            // dedupe: ['react', 'react-dom', '@base-ui/react', 'lucide-react', '@vitejs/plugin-react', '@vitejs/plugin-rsc', '@babel', 'rsc-html-stream', 'class-variance-authority', 'clsx']
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
                    "etag",
                    // Don't bundle node
                    /^node:/,
                    // Peer dependencies We don't have one for now
                    // import packageJson  from '../../../../package.json' with { type: 'json' };
                    // const { peerDependencies } = packageJson;
                ]
            },
            // for debugging ?
            minify: command == "build",
            sourcemap: command == "build",
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
                        // Main entry: https://rollupjs.org/configuration-options/#input
                        input: {
                            // generated as index.js
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
                        // Main entry: https://rollupjs.org/configuration-options/#input
                        input: {
                            // generated as index.js
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
                        // Main entry: https://rollupjs.org/configuration-options/#input
                        input: {
                            // generated as index.js
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
            imageMiddleware({command: command}),
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
            confWatcher(),
            mdxRollup({command}),
            // Component provider (provide the MdxComponent for mdx)
            mdxComponentProvider(),
            // Layout provider (provide the layouts dynamically)
            layoutProvider(),
            // Pages (after layout)
            pagesProvider(['mdx', 'tsx', 'jsx']),
            globalStylesheet(),
            outlineNumberingStyleSheet(),
            {
                enforce: "post", // runs after as we depend on the component plugin
                ...middlewareProvider()
            },
            // Rsc
            // At the end because the client entry import the virtual CSS (outline and global)
            // Note: you can use vite-plugin-inspect (https://github.com/antfu-collective/vite-plugin-inspect)
            // to understand how "use client" and "use server" directives are transformed internally.
            Inspect(),
            rsc(),
            ssg(),
        ],
    }
}
