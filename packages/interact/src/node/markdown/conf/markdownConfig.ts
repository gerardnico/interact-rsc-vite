/**
 * To be able to use Markdown on the client
 * we should be able to bundle this file
 * (ie the node path import below should be deleted (ie we need to use a virtual module to distribute the config)
 */
import path from "node:path";
import {getMandatoryUnifiedPlugins} from "./markdownPluginsMandatory.js";
import {type InteractCommand} from "../../cli/shared/vite.config.js";
import type {Options} from "@mdx-js/rollup";

type MarkdownConfig = Awaited<ReturnType<typeof createMarkdownConfig>>

/**
 * The components provider name
 * (for mdx)
 */
export const componentsProviderModuleName = "interact:mdx-components"

const GLOBAL_KEY = "__interactMarkdownProcessor"

const __dirname = dirname(fileURLToPath(import.meta.url));
import type {PluggableList} from "unified";
import {getInteractConfig} from "../../config/interactConfig.js";
import {fileURLToPath} from "node:url";
import {dirname} from "path";

/**
 * User config type
 */
export type InteractMarkdownConfig = {
    remarkPlugins?: PluggableList
    rehypePlugins?: PluggableList
}

export function setMarkdownConfigGlobally(processor: MarkdownConfig, force: boolean = false): void {
    const g = globalThis as any

    if (g[GLOBAL_KEY]) {
        if (!force) {
            throw new Error("Markdown processor already initialized")
        }
    }

    g[GLOBAL_KEY] = processor
}

export function getMarkdownConfig(): MarkdownConfig {
    const g = globalThis as any

    if (!g[GLOBAL_KEY]) {
        throw new Error("Markdown processor not initialized")
    }

    return g[GLOBAL_KEY]
}


export async function createMarkdownConfig() {

    const interactConfig = getInteractConfig()

    const initDefaultFormat = interactConfig.markdown.defaultMarkdownFormat

    /**
     * Markdown Configuration file
     * Should be in a virtual module/or a direct import
     * otherwise we get a Not Exist error when running the production bundle because it's not bundled
     */
    let extension = "ts"
    if (__dirname.includes("dist")) {
        extension = "js"
    }
    let markdownConfigImportPath = path.resolve(__dirname, `markdownPluginsUserDefault.${extension}`);
    const configImportPath = interactConfig.markdown.configImportPath;
    if (configImportPath != null) {
        // user configuration file was found
        markdownConfigImportPath = configImportPath;
    }

    let markdownConfModule;
    try {
        markdownConfModule = await import(/* @vite-ignore */ markdownConfigImportPath);
    } catch (err) {
        if (err instanceof Error) {
            let message = err.message;
            if ((err as NodeJS.ErrnoException).code === 'ERR_MODULE_NOT_FOUND') {
                message += `Internal Error: The module markdown configuration module was not found. Bad Path given: ${markdownConfigImportPath}`;
            }
            throw new Error(message);
        }
    }
    const markdownConfig = 'markdownConfig';
    if (!(markdownConfig in markdownConfModule)) {
        throw new Error(`The markdown configuration module (${markdownConfigImportPath}) has no ${markdownConfig} export`)
    }
    const initMarkdownUserConfig = markdownConfModule.markdownConfig
    const initMandatoryUnifiedPlugins = getMandatoryUnifiedPlugins(interactConfig)

    return {
        /**
         * Config for the Rollup Mdx Plugins Options
         * @param command
         */
        getMdxRollupConfig: function (command?: InteractCommand): Options {
            return {
                development: command == "start",
                mdExtensions: [], // When treated as Markdown, the custom elements are deleted
                mdxExtensions: ['.mdx', '.md'],
                //providerImportSource: import.meta.resolve('../../componentsProvider/componentsProvider.js')
                providerImportSource: this.getProviderImportSource(),
                remarkPlugins: this.getMdxConfig().remarkPlugins,
                rehypePlugins: this.getMdxConfig().rehypePlugins,
                recmaPlugins: this.getMdxConfig().recmaPlugins,
            }
        },
        getMdxConfig: function () {
            return {
                remarkPlugins: [
                    ...(this.getMdConfig().remarkPlugins || {}),
                    ...initMandatoryUnifiedPlugins.mdx.remarkPlugins,
                ],
                rehypePlugins: [
                    ...(this.getMdConfig().rehypePlugins || {}),
                    ...initMandatoryUnifiedPlugins.mdx.rehypePlugins,
                ],
                recmaPlugins: [
                    ...initMandatoryUnifiedPlugins.mdx.recmaPlugins,
                ]

            }
        },
        getMdConfig: function () {
            return {
                remarkPlugins: [
                    ...initMandatoryUnifiedPlugins.markdown.remarkPlugins,
                    ...(initMarkdownUserConfig.remarkPlugins || []),
                ],
                rehypePlugins: [
                    ...initMandatoryUnifiedPlugins.markdown.rehypePlugins,
                    ...(initMarkdownUserConfig.rehypePlugins || []),
                ]
            }
        },
        getDefaultMarkdownFormat() {
            return initDefaultFormat
        },
        getProviderImportSource: function () {
            return componentsProviderModuleName;
        }
    }
}