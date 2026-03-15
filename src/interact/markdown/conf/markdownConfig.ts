import path from "node:path";
import {getMandatoryUnifiedPlugins} from "./markdownPluginsMandatory.js";
import type {InteractCommand} from "../../cli/shared/vite.config.js";
import type {Options} from "@mdx-js/rollup";

type MarkdownConfig = Awaited<ReturnType<typeof createMarkdownConfig>>

const GLOBAL_KEY = "__interactMarkdownProcessor"

import type {PluggableList} from "unified";
import type {InteractConfig} from "../../config/configHandler.js";

/**
 * User config type
 */
export type InteractMarkdownConfig = {
    remarkPlugins?: PluggableList
    rehypePlugins?: PluggableList
}

export function setMarkdownConfigGlobally(processor: MarkdownConfig) {
    const g = globalThis as any

    if (g[GLOBAL_KEY]) {
        throw new Error("Markdown processor already initialized")
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

export type InteractMarkdownInit = {
    componentsProviderModuleName: string
    interactConfig: InteractConfig
};

export async function createMarkdownConfig(props: InteractMarkdownInit) {


    let initDefaultFormat = props.interactConfig.markdown.defaultMarkdownFormat

    /**
     * Markdown Configuration file
     */
    let markdownConfigImportPath = path.resolve(props.interactConfig.paths.srcDirectory, "markdown/conf/markdownPluginsUserDefault.js");
    let configImportPath = props.interactConfig.markdown.configImportPath;
    if (configImportPath != null) {
        if (configImportPath.startsWith(".")) {
            markdownConfigImportPath = path.resolve(props.interactConfig.paths.rootDirectory, configImportPath);
        }
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
    let markdownConfig = 'markdownConfig';
    if (!(markdownConfig in markdownConfModule)) {
        throw new Error(`The markdown configuration module (${markdownConfigImportPath}) has no ${markdownConfig} export`)
    }
    let initMarkdownUserConfig = markdownConfModule.markdownConfig
    let initMandatoryUnifiedPlugins = getMandatoryUnifiedPlugins(props.interactConfig)

    return {
        getMdxRollupConfig: function (command?: InteractCommand): Options {
            return {
                development: command == "start",
                mdExtensions: [], // When treated as Markdown, the custom elements are deleted
                mdxExtensions: ['.mdx', '.md'],
                //providerImportSource: import.meta.resolve('../../componentsProvider/componentsProvider.js')
                providerImportSource: this.getProviderImportSource(),
                remarkPlugins: this.getMdxConfig().remarkPlugins,
                rehypePlugins: this.getMdxConfig().rehypePlugins,
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
            return props.componentsProviderModuleName;
        }
    }
}