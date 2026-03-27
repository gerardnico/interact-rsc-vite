import path from "path";
import fs from "fs";
import type {Plugin} from "vite";
import type {InteractConfig} from "../config/interactConfig.js";

function isInteractAlias(importer: string) {
    return importer?.includes("interact");
}

let alias = "@"

/**
 * A plugin to resolve the at sign alias from our code or the code of the site
 */
export function viteAtSrcAliasCascadingResolution({interactConfig}: { interactConfig: InteractConfig }): Plugin {
    return {
        name: 'cascade-alias',
        // importer: the absolute path of the file that contains the import.
        resolveId(id, importer) {
            if (!id.startsWith('@/')) return null
            if (importer == null) return null;

            // strip `@/`
            const relative = id.slice(alias.length + 1)
            if (isInteractAlias(importer)) {
                return `${interactConfig.paths.interactDirectory}/${relative}`
            }

            const candidate = path.resolve(`${interactConfig.paths.rootDirectory}/src`, relative)
            // try common extensions
            for (const ext of ['', '.ts', '.tsx', '.js', '.jsx']) {
                if (fs.existsSync(candidate + ext)) {
                    return candidate + ext
                }
            }
            // let Vite handle it (will likely error)
            return null
        }
    }
}