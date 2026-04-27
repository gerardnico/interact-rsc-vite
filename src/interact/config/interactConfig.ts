/**
 * This file is used in the cli as well as in the resources
 * so it has no import/export expect for type
 */
import {
    type ComponentsSet, type pathsConfigType, type imageConfigType,
    type siteConfigType, type partialsConfigType, type outlineConfigType, type markdownConfigType,
    type aliasesConfigType, type MiddlewareConfig
} from "./configSchema.js";

/**
 * The config seen by the client
 * (no schema field and configFile and Root directory)
 */
export type InteractConfig = {
    partials: partialsConfigType,
    site: siteConfigType
    outline: outlineConfigType,
    components: ComponentsSet,
    middleware: MiddlewareConfig,
    images: imageConfigType,
    markdown: markdownConfigType,
    aliases: aliasesConfigType,
    paths: pathsConfigType & {
        rootDirectory: string, // making it not null for TypeScript
        configFile: string
        // The runtime/tmp directory, image cache, ...
        // output dir such as dist does not work as it will be cleaned up
        // For runtime, I see also: './node_modules/.xxx'
        // Example with vite
        // https://vite.dev/guide/dep-pre-bundling#file-system-cache
        cacheDirectory: string
        // The path of the interact resources directory
        interactResourcesDirectory: string
    }
}

const GLOBAL_KEY = "__interactConfig"

export function setInteractConfigGlobally(processor: InteractConfig, force: boolean = false) {
    const g = globalThis as any

    if (g[GLOBAL_KEY]) {
        if (!force) {
            throw new Error("Interact Config already initialized")
        }
    }

    g[GLOBAL_KEY] = processor
}

// noinspection JSUnusedGlobalSymbols - used via package.json export
export function getInteractConfig(): InteractConfig {
    const g = globalThis as any

    if (!g[GLOBAL_KEY]) {
        throw new Error("Interact Config not initialized")
    }

    return g[GLOBAL_KEY]
}