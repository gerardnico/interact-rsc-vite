import {
    JsonConfigSchema,
    type FaviconSetSchemaType,
    type pluginsConfigType, type componentsSetSchemaType, type pathsConfigType, type imageConfigType,
    type siteConfigType, type styleConfigType
} from "./configSchema.js";
import fs from 'fs'
import {readFileSync} from "node:fs";
import path from "node:path";


/**
 * Configuration source information
 */
export interface ConfigSource {
    config: InteractConfigType;
    loaded: boolean;
}

/**
 * #components is declared in the package.json imports property
 */
//const privateComponent = `#components`
const publicComponent = `@combostrap/interact/components`
const defaultComponentsValue: componentsSetSchemaType = {
    "Block": {
        importPath: `${publicComponent}/Block`,
        type: "content"
    },
    "Landing": {
        importPath: `${publicComponent}/Landing`,
        type: "layout"
    },
    "Holy": {
        importPath: `${publicComponent}/Holy`,
        type: "layout"
    },
    "pre": {
        importPath: `${publicComponent}/Code`,
        type: "content"
    },
    "a": {
        importPath: `${publicComponent}/Anchor`,
        type: "content"
    },
    "NavBar": {
        importPath: `${publicComponent}/NavBar`,
        type: "partial"
    },
    "Grid": {
        importPath: `${publicComponent}/Grid`,
        type: "content"
    },
    "GridCell": {
        importPath: `${publicComponent}/GridCell`,
        type: "content"
    },
    "Text": {
        importPath: `${publicComponent}/Text`,
        type: "content"
    },
    "Para": {
        importPath: `${publicComponent}/Para`,
        type: "content"
    },
    "RufflePlayer": {
        importPath: `${publicComponent}/RufflePlayer`,
        type: "content"
    },
    "StarRating": {
        importPath: `${publicComponent}/StarRating`,
        type: "content"
    },
    "Image": {
        importPath: `${publicComponent}/Image`,
        type: "content"
    },
    "NotFound": {
        importPath: `${publicComponent}/NotFound`,
        type: "page"
    },
    "Svg": {
        importPath: `${publicComponent}/Svg`,
        type: "content"
    }
}

const defaultMarkdownUnifiedPlugins: pluginsConfigType = {
    "rehype-github-alerts": {},
    "rehype-href-rewrite": {},
    "remark-link-checker": {
        props: {strict: true}
    },
    "remark-layout": {},
    "remark-frontmatter-modified-time": {}
}

// Based on https://realfavicongenerator.net
let defaultFavicons: FaviconSetSchemaType = {
    "favicon.ico": {
        rel: "shortcut icon",
    },
    "favicon-96x96.png": {
        rel: "icon",
        image: {
            type: "image/png",
            width: 96,
            height: 96
        }
    },
    "favicon.svg": {
        rel: "icon",
        image: {
            type: "image/svg+xml"
        }
    },
    "apple-touch-icon.png": {
        rel: "apple-touch-icon",
        image: {
            width: 180,
            height: 180
        }
    }
};

function updateFavicon(favicons?: FaviconSetSchemaType | undefined): FaviconSetSchemaType {
    if (!favicons) {
        favicons = {}
    }
    for (let [faviconName, faviconProperties] of Object.entries(defaultFavicons)) {
        if (faviconName in Object.keys(favicons)) {
            continue
        }
        if (fs.existsSync(`public/${faviconName}`)) {
            favicons[faviconName] = faviconProperties
        }
    }
    return favicons;
}


export type ConfigHandlerProps = {
    rootPath?: string
};

const configFileName = 'interact.config.json'

export interface ConfPathResolvedType {
    rootDirectory: string;
    filePath: string;
}

/**
 * The interact conf path may be the config file or a directory
 * @param confPath
 */
export function resolveInteractConfPath(confPath: string | undefined): ConfPathResolvedType {

    const finalConfPath = confPath || process.env['INTERACT_CONF_PATH'] || process.cwd();
    if (finalConfPath.endsWith(configFileName)) {
        return {
            rootDirectory: path.dirname(finalConfPath),
            filePath: finalConfPath
        }
    }
    return {
        rootDirectory: finalConfPath,
        filePath: path.join(finalConfPath, `${configFileName}`)
    }

}

let interactConfig: InteractConfigType | null = null

/**
 * To resolve only once
 * Why? We need the conf on initialization for vite
 * and just after to create the virtual module
 * This way we process the file once
 */
export function resolveInteractConfig(resolvedConf: ConfPathResolvedType) {
    if (interactConfig != null) {
        return interactConfig
    }
    interactConfig = new ConfigHandler(resolvedConf).getConfig();
    return interactConfig;
}

/**
 * Deep merge two objects
 * Source wins (The last argument win) in case of conflict on primitive type
 * We use the same order as in an object with ...
 */
function deepMerge(target: any, source: any) {
    if (target == null) return source;
    if (source == null) return target;

    const output = {...target};

    const allKeys = new Set([...Object.keys(target), ...Object.keys(source)]);

    for (const key of allKeys) {
        const inTarget = key in target;
        const inSource = key in source;
        // console.log("Deep Merge on " + key + " (Source: " + inSource + ", target: " + inTarget + ")");
        if (inTarget && inSource) {
            if (target[key] instanceof Object && source[key] instanceof Object) {
                // console.log("Recursive Deep Merge on " + key)
                output[key] = deepMerge(target[key], source[key]);
                continue
            }
            // primitive type, source win
            output[key] = source[key];
            continue;
        }
        if (inSource) {
            output[key] = source[key];
        }
        // if in target, already in
        //output[key] = target[key];
    }

    return output;
}

/**
 * The config seen by the client
 * (no schema field and configFile and Root directory)
 */
export type InteractConfigType = {
    style: styleConfigType,
    site: siteConfigType
    plugins: pluginsConfigType,
    components: componentsSetSchemaType,
    images: imageConfigType,
    paths: pathsConfigType & {
        configFile: string
        // "The root path of the site project"
        rootDirectory: string
    }
}

/**
 * The main function
 */
// noinspection JSUnusedGlobalSymbols - It's used in a virtual module, so never detected as imported by the IDE
class ConfigHandler {

    private readonly configFile: string;
    private readonly rootDirectory: string;
    private readonly interactConfig: InteractConfigType;

    constructor(confPathResolved: ConfPathResolvedType) {
        this.configFile = confPathResolved.filePath;
        this.rootDirectory = confPathResolved.rootDirectory;
        this.interactConfig = this.#process()
    }

    #addDefaultAndRuntime(finalConfigData: InteractConfigType) {


        finalConfigData.site.favicons = updateFavicon(finalConfigData?.site?.favicons);
        // let rehypeHrefRewrite = finalConfigData.plugins["rehype-href-rewrite"];
        // if (rehypeHrefRewrite != null) {
        //     let baseValue = finalConfigData.site?.base;
        //     if (typeof rehypeHrefRewrite.props === 'undefined') {
        //         rehypeHrefRewrite.props = {
        //             base: baseValue,
        //         }
        //     } else {
        //         rehypeHrefRewrite.props['base'] = baseValue;
        //     }
        // }

        finalConfigData.paths = {
            configFile: this.configFile,
            rootDirectory: this.rootDirectory,
            pagesDirectory: this.#qualifiedDirectoryPath(finalConfigData.paths.pagesDirectory),
            publicDirectory: this.#qualifiedDirectoryPath(finalConfigData.paths.publicDirectory),
            imagesDirectory: this.#qualifiedDirectoryPath(finalConfigData.paths.imagesDirectory)
        }

        /**
         * Default plugins
         */
        finalConfigData.plugins = deepMerge(defaultMarkdownUnifiedPlugins, finalConfigData.plugins)

        /**
         * Default components
         */
        finalConfigData.components = deepMerge(defaultComponentsValue, finalConfigData.components)

    }

    #qualifiedDirectoryPath(basePath: string) {
        if (!basePath.startsWith("/")) {
            return path.resolve(this.rootDirectory, basePath);
        }
        return path.resolve(basePath);

    }

    #parseAndAddDefaults(param: {}) {
        const result = JsonConfigSchema.safeParse(param);
        if (!result.success) {
            let errorMessage = result.error.issues
                .map(issue => {
                    const path = issue.path.join('.');
                    return `• ${path}: ${issue.message}`;
                })
                .join('\n');
            console.error('Configuration errors:\n' + errorMessage);
            // noinspection ExceptionCaughtLocallyJS
            throw new Error("Configuration error")
        }

        let finalConfigData = (result.data as InteractConfigType)
        this.#addDefaultAndRuntime(finalConfigData)

        return finalConfigData;
    }

    /**
     * Load configuration with fallback to defaults
     */
    #process(): InteractConfigType {


        let configContent: string;
        try {
            // Try to import the config file
            configContent = readFileSync(this.configFile, 'utf-8');
        } catch (error) {
            const err = error as NodeJS.ErrnoException;
            if (err.code === 'ENOENT') {
                // Config file doesn't exist
                console.warn(`No ${(this.configFile)} found, using default configuration`);
                return this.#parseAndAddDefaults({});
            }
            console.error(`Unexpected error ${err.code} while reading the config file: ${(this.configFile)}`);
            throw error;
        }
        console.log(`${(this.configFile)} found`);
        let data: Object;
        try {
            data = JSON.parse(configContent)
        } catch (error) {
            console.error(`The config file is not a valid Json file: ${(this.configFile)}`);
            console.error(`Error: ${String(error)}`);
            throw error;
        }

        return this.#parseAndAddDefaults(data);


    }

    getConfig(): InteractConfigType {
        return this.interactConfig
    }

}

