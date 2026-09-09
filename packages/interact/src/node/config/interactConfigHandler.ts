import {
    JsonConfigSchema,
    type FaviconSetSchemaType,
    type ComponentsSet, type ComponentTypeType
} from "./configSchema.js";
import fs, {existsSync} from 'fs'
import {readdirSync, readFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import type {InteractConfig} from "./interactConfig.js";
import {atAliasCharacter} from "../vite/atAliasResolution.js";
import deepMerge from "../lib/deep-merge.js";
import {join} from "path";
import {getPackageJsonDir} from "./packageJsonUtil.js";


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
    "Grid": {
        importPath: `${atInteractComponentPath}/Grid`,
        type: "markdown"
    },
    "GridCell": {
        importPath: `${atInteractComponentPath}/GridCell`,
        type: "markdown"
    },
    "Icon": {
        importPath: `${atInteractComponentPath}/Icon`,
        type: "markdown"
    },
    "Image": {
        importPath: `${atInteractComponentPath}/Image`,
        type: "markdown"
    },
    "pre": {
        importPath: `${atInteractComponentPath}/Code`,
        type: "markdown"
    },
    "Raster": {
        importPath: `${atInteractComponentPath}/Raster`,
        type: "markdown"
    },
    "table": {
        importPath: `${atInteractComponentPath}/Table`,
        type: "markdown"
    },
    "Svg": {
        importPath: `${atInteractComponentPath}/Svg`,
        type: "markdown"
    }
}


// Based on https://realfavicongenerator.net
const defaultFavicons: FaviconSetSchemaType = {
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
    for (const [faviconName, faviconProperties] of Object.entries(defaultFavicons)) {
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
    const manifestPath = `${publicDirectory}/${manifestFileName}`;
    if (fs.existsSync(manifestPath)) {
        return fileToCheck
    }
    if (manifestFileName != null) {
        throw new Error(`The given site manifest ${manifestFileName} was not found. Files ${manifestPath} does not exist.`)
    }
    return;
}

const configFileName = 'interact.config.json'


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
        const interactRootDirectory = path.resolve(__dirname, '../../..');

        let rootDirectory = path.dirname(this.configFile);
        if (finalConfigData.paths.rootDirectory != null) {
            rootDirectory = finalConfigData.paths.rootDirectory;
        }

        /**
         * Global Cli App run support
         * (ie project without package.json)
         * Check the use of the boolean to see the configuration change
         */
        let nodeModuleRootDirectory = rootDirectory
        const packageJson = join(nodeModuleRootDirectory, "package.json");
        const isStandaloneProject = !existsSync(packageJson);
        if (isStandaloneProject) {
            const startDir = fileURLToPath(import.meta.url);
            const foundNodeModuleRoot = getPackageJsonDir({
                startDir: startDir,
                // in a mono repo, don't take the root, otherwise it's not the interact project
                firstAncestor: true
            })
            if (foundNodeModuleRoot == null) {
                throw new Error(`Internal error, no package.json found from ${startDir}`);
            }
            nodeModuleRootDirectory = foundNodeModuleRoot
            console.log(`Project Type: Standalone`)
        } else {
            console.log(`Project Type: Node Project (package.json)`)
        }

        const runtimeDirectory = this.#qualifiedDirectoryPath(rootDirectory, ".interact");
        finalConfigData.paths = {
            configFile: this.configFile,
            rootDirectory: rootDirectory,
            nodeDirectory: nodeModuleRootDirectory,
            pagesDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.pagesDirectory),
            publicDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.publicDirectory),
            imagesDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.imagesDirectory),
            headsDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.headsDirectory),
            contextsDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.contextsDirectory),
            layoutsDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.layoutsDirectory),
            mdComponentsDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.mdComponentsDirectory),
            middlewaresDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.middlewaresDirectory),
            configDirectory: this.#qualifiedDirectoryPath(rootDirectory, finalConfigData.paths.configDirectory),
            runtimeDirectory: runtimeDirectory,
            htmlCacheDirectory: path.resolve(runtimeDirectory, "html-cache"),
            interactResourcesDirectory: path.resolve(interactRootDirectory, 'src/resources'),
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
         * Add layout
         * (partials are not needed as the user import them from layout component)
         * Ie: import Header from "@/components/partials/Header";
         */
        const types: ComponentTypeType[] = ['layout', 'markdown', 'head', 'context'];
        for (const type of types) {
            let projectPath;
            switch (type) {
                case 'layout':
                    projectPath = finalConfigData.paths.layoutsDirectory
                    break;
                case 'markdown':
                    projectPath = finalConfigData.paths.mdComponentsDirectory
                    break;
                case "head":
                    projectPath = finalConfigData.paths.headsDirectory;
                    break;
                case "context":
                    projectPath = finalConfigData.paths.contextsDirectory;
                    break;
                default:
                    throw new Error(`Internal Unknown type '${type}'`);
            }

            const layoutDirectories = [`${finalConfigData.paths.interactResourcesDirectory}/components/${type}s`, projectPath];

            for (const [i, layoutDirectory] of layoutDirectories.entries()) {
                const isProjectDir = i == 1

                if (!existsSync(layoutDirectory)) {
                    if (isProjectDir) {
                        continue
                    }
                    if (import.meta.env.DEV) {
                        throw new Error(`Internal Error: Interact layout dir should exist in dev: ${layoutDirectory}`)
                    } else {
                        // only needed when building, not in production
                        continue
                    }

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
                    // skipping Interact Context
                    // It's the file <InteractContext>
                    // and is hard written in the entry.browser.tsx
                    // We still let the InteractContext as registred so that the user can see it
                    if (type === 'context' && !isProjectDir && name !== 'InteractContext') {
                        continue;
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
            const isProjectDir = i == 1
            if (!existsSync(middlewaresDirectory)) {
                if (isProjectDir) {
                    continue
                }
                if (import.meta.env.DEV) {
                    throw new Error(`Internal Error: Interact middlewares dir should exist in dev: ${middlewaresDirectory}`)
                } else {
                    // only needed when dev/building, not when running the bundle in a server
                    continue
                }
            }

            const filesNaturalSort = fs
                .readdirSync(middlewaresDirectory)
                .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));

            for (const fileName of filesNaturalSort) {
                const {name, ext} = path.parse(fileName);
                if (!/\.(jsx|tsx|js)$/.test(ext)) continue;
                let importPath = path.resolve(middlewaresDirectory, fileName);
                if (isProjectDir) {
                    importPath = importPath.replace(finalConfigData.paths.atDirectory, atAliasCharacter);
                } else {
                    importPath = `@combostrap/interact/middlewares/${name}`;
                }
                finalConfigData.middleware.pipeline.push({
                    importPath: importPath,
                })
            }
        }

        /**
         * Default Markdown
         */
        const markdownConfigImportPath = finalConfigData.markdown.configImportPath;
        if (markdownConfigImportPath == null) {
            const extensions = [".js", ".js"]
            for (const extension of extensions) {
                const markdownConfig = path.resolve(finalConfigData.paths.configDirectory, `markdown.config${extension}`);
                if (fs.existsSync(markdownConfig)) {
                    finalConfigData.markdown.configImportPath = markdownConfig
                    break;
                }
            }
        } else {
            // Value in the interact.config.file
            if (markdownConfigImportPath.startsWith(".")) {
                // Relative file from the root
                finalConfigData.markdown.configImportPath = path.resolve(finalConfigData.paths.rootDirectory, markdownConfigImportPath);
            } else {
                finalConfigData.markdown.configImportPath = markdownConfigImportPath;
            }
            if (!fs.existsSync(finalConfigData.markdown.configImportPath)) {
                throw new Error(`Defined markdown configuration file (${finalConfigData.markdown.configImportPath}) does not exist.`)
            }
        }

        /**
         * Svg
         */
        finalConfigData.svg = {
            svgo: {
                plugins: [
                    {
                        name: "preset-default",
                        params: {
                            overrides: {
                                removeUselessStrokeAndFill: {
                                    stroke: true,
                                    fill: true,
                                    // Don't remove the fill:None value, by default, it will be black,
                                    // user may also use transparent as value
                                    removeNone: false
                                },
                            },
                        },
                    },
                    {name: 'removeTitle'},
                    {name: 'removeDoctype'},
                    {name: "removeDimensions"} // strip width and dimension and add viewBox if missing
                ],
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
            const errorMessage = result.error.issues
                .map(issue => {
                    const path = issue.path.join('.');
                    return `• ${path}: ${issue.message}`;
                })
                .join('\n');
            console.error('Configuration errors:\n' + errorMessage);
            // noinspection ExceptionCaughtLocallyJS
            throw new Error("Configuration error")
        }

        const finalConfigData = (result.data as InteractConfig)
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
        console.log(`Interact config file found at: ${(this.configFile)}`);
        let data: object;
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

