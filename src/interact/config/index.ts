import {type InteractConfigType, JsonConfigSchema, type FaviconSetSchemaType} from "./configSchema.js";
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

function updateFavicon(favicons?: FaviconSetSchemaType): FaviconSetSchemaType {
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

class ConfigHandler {

    private readonly configFile: string;
    private readonly rootPath: string;

    constructor() {

        const interactRootPath = process.env.INTERACT_ROOT_PATH
        if (!interactRootPath) {
            this.rootPath = process.cwd();
        } else {
            this.rootPath = interactRootPath;
        }
        this.configFile = path.join(this.rootPath, `${configFileName}`);

    }

    #addDefaultAndRuntime(finalConfigData: InteractConfigType) {


        finalConfigData.site.favicons = updateFavicon(finalConfigData.site.favicons);
        let rehypeHrefRewrite = finalConfigData.plugins["rehype-href-rewrite"];
        if (rehypeHrefRewrite != null) {
            let baseValue = finalConfigData.site?.base;
            if (typeof rehypeHrefRewrite.props === 'undefined') {
                rehypeHrefRewrite.props = {
                    base: baseValue,
                }
            } else {
                rehypeHrefRewrite.props.base = baseValue;
            }
        }

        finalConfigData.env = {
            configFilePath: this.configFile
        }

        /**
         * Root Path
         */
        finalConfigData.site.rootPath = this.rootPath;

        finalConfigData.pages.pagesDirectory = this.#qualifiedDirectoryPath(finalConfigData.pages.pagesDirectory);
        finalConfigData.public.publicDirectory = this.#qualifiedDirectoryPath(finalConfigData.public.publicDirectory);
        finalConfigData.images.imagesDirectory = this.#qualifiedDirectoryPath(finalConfigData.images.imagesDirectory);

    }

    #qualifiedDirectoryPath(basePath: string) {
        if (!basePath.startsWith("/")) {
            return path.resolve(this.rootPath, basePath);
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
    getConfig(): InteractConfigType {


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

    getConfigFilePath() {
        return this.configFile
    }
}

let configHandler = new ConfigHandler();
export const interactConfigFilePath = configHandler.getConfigFilePath()
let interactConfig = configHandler.getConfig();
export default interactConfig;
