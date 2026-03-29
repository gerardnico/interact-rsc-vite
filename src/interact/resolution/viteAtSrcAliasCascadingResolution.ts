import fs from "fs";
import type {Plugin} from "vite";
import {getInteractConfig} from "../config/interactConfig.js";

function isInteractAlias(importer: string) {
    return importer?.includes("combostrap/interact");
}

let alias = "@"

/**
 * A plugin to resolve the at sign alias from our code or the code of the site
 * Shadcn alias: https://ui.shadcn.com/docs/installation/vite#update-viteconfigts
 */
export function viteAtSrcAliasCascadingResolution(): Plugin {
    let interactConfig = getInteractConfig()
    return {
        name: 'cascade-alias',
        // importer: the absolute path of the file that contains the import.
        resolveId(id, importer) {
            if (!id.startsWith('@/')) return null
            if (importer == null) return null;

            // strip `@/`
            let relative = id.slice(alias.length + 1)
            // delete extension if any
            let lastPoint = relative.lastIndexOf(".")
            if (lastPoint != -1) {
                relative = relative.slice(0, lastPoint)
            }
            let candidate;
            if (isInteractAlias(importer)) {
                candidate = `${interactConfig.paths.interactDirectory}/${relative}`
            } else {
                candidate = `${interactConfig.paths.rootDirectory}/src/${relative}`;
            }
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