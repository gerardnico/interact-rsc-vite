import path from "node:path";
import mdx from "@mdx-js/rollup";
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
import viteMdxComponentProvider from "../../componentsProvider/viteVirtualComponentProviders.js";
import svgReactPlugin from "vite-plugin-svgr";
import viteOutlineNumberingStylesPlugin from "../../styling/viteOutlineNumberingStyleProvider.js";
import {viteCmsMiddlewareProvider} from "../../cms/viteCmsMiddlewareProvider.js";
import {getMandatoryUnifiedPlugins} from "../../markdown/conf/markdownBasePlugins.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Directory of the code
 */
const interactPackageDir = path.resolve(__dirname, '../..');

type InteractCommand = 'start' | 'build' | 'preview';
type LogLevel = 'info' | 'warn' | 'error' | 'silent';
type InteractConfig = {
    confPath: string,
    command?: InteractCommand;
    port?: number,
    outDir?: string;
    logLevel?: LogLevel;
};

export function resolveViteConfig(
    {
        confPath,
        port,
        command,
        outDir = "dist"
    }: InteractConfig): InlineConfig {

    const resolvedConfPath = resolveInteractConfPath(confPath);
    const interactConfigTyped = resolveInteractConfig(resolvedConfPath);

    // https://vite.dev/guide/build#public-base-path
    let publicBasePath = ""


    let cachePath = path.resolve(interactConfigTyped.paths.cacheDirectory, "cache")


    // Note: You can merge also
    // https://vite.dev/guide/api-javascript#mergeconfig
    let outDistDir;
    if (!outDir.startsWith("/")) {
        outDistDir = path.resolve(resolvedConfPath.rootDirectory, outDir);
    } else {
        outDistDir = outDir;
    }

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

    /**
     * The components provider name
     * (for mdx and layout)
     */
    const componentsProviderModuleName = "interact:components"

    const mandatoryUnifiedPlugins = getMandatoryUnifiedPlugins(interactConfigTyped)

    /**
     * Markdown Configuration file
     */
    let markdownConfigImportPath = path.resolve(interactPackageDir, "markdown/conf/markdownConfigDefault.js");
    let configImportPath = interactConfigTyped.markdown.configImportPath;
    if (configImportPath != null) {
        if (configImportPath.startsWith(".")) {
            markdownConfigImportPath = path.resolve(confPath, configImportPath);
        }
    }

    return {
        mode: command == "build" ? "production" : "development",
        logLevel: 'info', // or 'warn' — try 'info' first
        root: confPath,
        base: publicBasePath,
        server: {
            port: port,
        },
        resolve: {
            // https://vite.dev/config/shared-options#resolve-alias
            // When aliasing to file system paths, always use absolute paths.
            alias: {
                "@interact/markdown-config": markdownConfigImportPath,
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
            pageModulesPlugin(interactConfigTyped.paths.pagesDirectory, ['mdx', 'tsx', 'jsx']),
            viteImageService({
                baseDir: interactConfigTyped.paths.imagesDirectory,
                cacheDir: command === 'start' ? undefined : path.resolve(cachePath, "img"),
                secret: process.env[imageSecretEnvName],
                endPoint: imageMiddlewareEndPoint
            }),
            viteVirtualConfModule(resolvedConfPath),
            // used by mdx
            viteMdxComponentProvider({moduleName: componentsProviderModuleName, interactConfig: interactConfigTyped}),
            // https://mdxjs.com/packages/mdx/#processoroptions
            mdx({
                development: command == "start",
                mdExtensions: [], // When treated as Markdown, the custom elements are deleted
                mdxExtensions: ['.mdx', '.md'],
                //providerImportSource: import.meta.resolve('../../componentsProvider/componentsProvider.js')
                providerImportSource: componentsProviderModuleName,
                remarkPlugins: [
                    ...mandatoryUnifiedPlugins.markdown.remarkPlugins,
                    ...mandatoryUnifiedPlugins.mdx.remarkPlugins,
                ],
                rehypePlugins: [
                    ...mandatoryUnifiedPlugins.markdown.rehypePlugins,
                    ...mandatoryUnifiedPlugins.mdx.rehypePlugins,
                ]
            }),
            react(),
            // https://www.npmjs.com/package/vite-plugin-svgr
            svgReactPlugin({
                include: '**/*.svg',
                svgrOptions: {
                    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
                    svgoConfig: {
                        plugins: ['preset-default', 'removeTitle', 'removeDesc', 'removeDoctype', 'cleanupIds'],
                    },
                },
            }),
            viteOutlineNumberingStylesPlugin(interactConfigTyped),
            viteCmsMiddlewareProvider(
                [{
                    importPath: path.resolve(interactPackageDir, 'cms/localPageCmsMiddleware.js'),
                    props: {
                        pagesDirectory: interactConfigTyped.paths.pagesDirectory
                    }
                }]
            ),
        ],
    }
}
