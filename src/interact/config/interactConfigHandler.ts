import {
    JsonConfigSchema,
    type FaviconSetSchemaType,
    type ComponentsSet
} from "./configSchema.js";
import fs, {existsSync} from 'fs'
import {readdirSync, readFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import type {InteractConfig} from "./interactConfig.js";
import {atAliasCharacter} from "../vite/atAliasResolution.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * #components is declared in the package.json imports property
 */
//const privateComponent = `#components`
const atInteractComponentPath = "@combostrap/interact/components"
export const defaultComponentsValue: ComponentsSet = {
    "a": {
        importPath: `${atInteractComponentPath}/Anchor`,
        type: "markdown"
    },
    "Avatar": {
        importPath: `${atInteractComponentPath}/Avatar`,
        type: "markdown"
    },
    "Code": {
        importPath: `${atInteractComponentPath}/Code`,
        type: "markdown"
    },
    "code": {
        importPath: `${atInteractComponentPath}/Mark`,
        type: "markdown"
    },
    // "Grid": {
    //     importPath: `${atInteractComponentPath}/Grid`,
    //     type: "markdown"
    // },
    // "GridCell": {
    //     importPath: `${atInteractComponentPath}/GridCell`,
    //     type: "markdown"
    // },
    "Icon": {
        importPath: `${atInteractComponentPath}/Icon`,
        type: "markdown"
    },
    "Image": {
        importPath: `${atInteractComponentPath}/Image`,
        type: "markdown"
    },
    // "Para": {
    //     importPath: `${atInteractComponentPath}/Para`,
    //     type: "markdown"
    // },
    "pre": {
        importPath: `${atInteractComponentPath}/Code`,
        type: "markdown"
    },
    // "RufflePlayer": {
    //     importPath: `${atInteractComponentPath}/RufflePlayer`,
    //     type: "markdown"
    // },
    // "StarRating": {
    //     importPath: `${atInteractComponentPath}/StarRating`,
    //     type: "markdown"
    // },
    "table": {
        importPath: `${atInteractComponentPath}/Table`,
        type: "markdown"
    },
    // "Text": {
    //     importPath: `${atInteractComponentPath}/Text`,
    //     type: "markdown"
    // },
    "NotFound": {
        importPath: `@combostrap/interact/pages/NotFound`,
        type: "page"
    },
    "Svg": {
        importPath: `${atInteractComponentPath}/Svg`,
        type: "markdown"
    }
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

function updateFavicon({favicons, publicDirectory}: {
    favicons?: FaviconSetSchemaType | undefined,
    publicDirectory: string
}): FaviconSetSchemaType {
    if (!favicons) {
        favicons = {}
    }
    for (let [faviconName, faviconProperties] of Object.entries(defaultFavicons)) {
        if (faviconName in Object.keys(favicons)) {
            continue
        }
        if (fs.existsSync(`${publicDirectory}/${faviconName}`)) {
            favicons[faviconName] = faviconProperties
        }
    }
    return favicons;
}

function updateManifest({manifestFileName, publicDirectory}: {
    manifestFileName: string | undefined,
    publicDirectory: string
}): string | undefined {
    let fileToCheck = manifestFileName;
    if (fileToCheck == null) {
        fileToCheck = "/site.webmanifest"
    }
    let manifestPath = `${publicDirectory}/${manifestFileName}`;
    if (fs.existsSync(manifestPath)) {
        return fileToCheck
    }
    if (manifestFileName != null) {
        throw new Error(`The given site manifest ${manifestFileName} was not found. Files ${manifestPath} does not exist.`)
    }
    return;
}

const configFileName = 'interact.config.json'


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


export function createInteractConfig(confPath?: string) {
    return new InteractConfigHandler(confPath).getConfig();
}

/**
 * The main function
 */
class InteractConfigHandler {

    private readonly configFile: string;
    private readonly interactConfig: InteractConfig;

    constructor(confPath: string | undefined) {
        // resolve to get an absolute path
        const finalConfPath = path.resolve(confPath || process.env['INTERACT_CONF_PATH'] || process.cwd());
        if (finalConfPath.endsWith(configFileName)) {
            this.configFile = finalConfPath;
        } else {
            this.configFile = path.resolve(finalConfPath, configFileName);
        }
        this.interactConfig = this.#process()
    }

    #addDefaultAndRuntime(finalConfigData: InteractConfig) {

        /**
         * Directory of the code with the `Interact` package.json,
         * this module (interactConfigHandler) will be in src in dev and dist in prod (when distributed)
         */
        let interactRootDirectory = path.resolve(__dirname, '../../..');

        let rootDirectory = path.dirname(this.configFile);
        if (finalConfigData.paths.rootDirectory != null) {
            rootDirectory = finalConfigData.paths.rootDirectory;
        }

        finalConfigData.paths = {
            configFile: this.configFile,
            rootDirectory: rootDirectory,
            pagesDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.pagesDirectory),
            publicDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.publicDirectory),
            imagesDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.imagesDirectory),
            layoutsDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.layoutsDirectory),
            mdComponentsDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.mdComponentsDirectory),
            middlewaresDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.middlewaresDirectory),
            configDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.configDirectory),
            cacheDirectory: this.#qualifiedDirectoryPath(rootDirectory, ".interact"),
            interactResourcesDirectory: path.resolve(rootDirectory, interactRootDirectory, 'src/resources'),
            buildDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.buildDirectory),
            cssFile: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.cssFile),
            atDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.atDirectory)
        }

        finalConfigData.site.favicons = updateFavicon(
            {
                favicons: finalConfigData?.site?.favicons,
                publicDirectory: finalConfigData.paths.publicDirectory
            }
        );
        finalConfigData.site.manifest = updateManifest(
            {
                manifestFileName: finalConfigData.site.manifest,
                publicDirectory: finalConfigData.paths.publicDirectory
            }
        );


        /**
         * Default ui components
         */
        finalConfigData.components = deepMerge(defaultComponentsValue, finalConfigData.components)

        /**
         * Add layout (partials are not needed)
         */
        const types: ('layout' | 'markdown')[] = ['layout', 'markdown'];
        for (const type of types) {
            let projectPath;
            if (type === 'layout') {
                projectPath = finalConfigData.paths.layoutsDirectory
            } else {
                projectPath = finalConfigData.paths.mdComponentsDirectory
            }
            const layoutDirectories = [`${finalConfigData.paths.interactResourcesDirectory}/components/${type}s`, projectPath];

            for (const [i, layoutDirectory] of layoutDirectories.entries()) {
                let isProjectDir = i == 1

                if (isProjectDir && !existsSync(layoutDirectory)) {
                    // interact dir should exist, we don't check
                    // it will fail at readDir
                    continue
                }

                for (const fileName of readdirSync(layoutDirectory)) {
                    const {name, ext} = path.parse(fileName);
                    if (!/\.(jsx|tsx|js)$/.test(ext)) continue;
                    let importPath = path.resolve(layoutDirectory, fileName);
                    if (isProjectDir) {
                        importPath = importPath.replace(finalConfigData.paths.atDirectory, atAliasCharacter);
                    } else {
                        importPath = `@combostrap/interact/components/${type}s/${name}`;
                    }
                    finalConfigData.components[name] = {
                        importPath: importPath,
                        type: type
                    }
                }
            }
        }

        /**
         * Middlewares
         */
        const middlewareDirectories = [`${finalConfigData.paths.interactResourcesDirectory}/middlewares`, finalConfigData.paths.middlewaresDirectory];
        for (const [i, middlewaresDirectory] of middlewareDirectories.entries()) {
            let isProjectDir = i == 1
            if (isProjectDir && !existsSync(middlewaresDirectory)) {
                // interact dir should exist, we don't check
                // it will fail at readDir
                continue
            }

            const filesNaturalSort = fs
                .readdirSync(middlewaresDirectory)
                .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));

            for (const fileName of filesNaturalSort) {
                const {name,ext} = path.parse(fileName);
                if (!/\.(jsx|tsx|js)$/.test(ext)) continue;
                let importPath = path.resolve(middlewaresDirectory, fileName);
                if (isProjectDir) {
                    importPath = importPath.replace(finalConfigData.paths.atDirectory, atAliasCharacter);
                } else {
                    importPath = `@combostrap/interact/middlewares/${name}`;
                }
                finalConfigData.middlewares.push({
                    importPath: importPath,
                })
            }
        }

        /**
         * Default Markdown
         */
        if (finalConfigData.markdown.configImportPath == null) {
            const extensions = [".js", ".ts"]
            for (const extension of extensions) {
                const markdownConfig = path.resolve(rootDirectory, `markdown.config${extension}`);
                if (fs.existsSync(markdownConfig)) {
                    finalConfigData.markdown.configImportPath = markdownConfig
                    break;
                }
            }
        }

    }

    #qualifiedDirectoryPath(rootDirectory: string, basePath: string
    ) {
        if (!basePath.startsWith("/")) {
            return path.resolve(rootDirectory, basePath);
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

        let finalConfigData = (result.data as InteractConfig)
        this.#addDefaultAndRuntime(finalConfigData)

        return finalConfigData;
    }

    /**
     * Load configuration with fallback to defaults
     */
    #process(): InteractConfig {

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

    getConfig(): InteractConfig {
        return this.interactConfig
    }

}

