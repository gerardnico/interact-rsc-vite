import {readFile} from 'fs/promises';
import {type Config, JsonConfigSchema, type FaviconSetSchemaType} from "./jsonConfigSchema";
import fs from 'fs'

/**
 * Configuration source information
 */
export interface ConfigSource {
    config: Config;
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

/**
 * Load configuration with fallback to defaults
 */
export async function loadConfig(configFile:string): Promise<ConfigSource> {


    let configContent: string;
    try {
        // Try to import the config file
        configContent = await readFile(configFile, 'utf-8');
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === 'ENOENT') {
            // Config file doesn't exist
            console.warn(`No ${configFile} found, using default configuration`);
            return {
                config: JsonConfigSchema.parse({}),
                loaded: false,
            };
        }
        console.error(`Unexpected error ${err.code} while reading the config file: ${configFile}`);
        throw error;
    }
    console.log(`${configFile} found`);
    let data: Object;
    try {
        data = JSON.parse(configContent)
    } catch (error) {
        console.error(`The config file is not a valid Json file: ${configFile}`);
        console.error(`Error: ${String(error)}`);
        throw error;
    }
    const result = JsonConfigSchema.safeParse(data);
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

    result.data.theme.site.favicons = updateFavicon(result.data.theme.site.favicons);
    let rehypeHrefRewrite = result.data.plugins["rehype-href-rewrite"];
    if (rehypeHrefRewrite != null) {
        let baseValue = result.data.theme.site?.base;
        if (typeof rehypeHrefRewrite.props === 'undefined') {
            rehypeHrefRewrite.props = {
                base: baseValue,
            }
        } else {
            rehypeHrefRewrite.props.base = baseValue;
        }
    }
    return {
        config: result.data,
        loaded: true,
    };


}
