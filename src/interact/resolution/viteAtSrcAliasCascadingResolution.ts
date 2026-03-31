import fs from "fs";
import type {Plugin} from "vite";
import {getInteractConfig} from "../config/interactConfig.js";

/**
 * Local Laptop: /home/admin/code/combostrap/interact/src/lib/components/Avatar.tsx
 * CI: /home/runner/work/interact/interact/src/lib/components/Avatar.tsx
 */
function isInteractAlias(importer: string) {
    return importer?.includes("combostrap/interact") || importer?.includes("interact/interact");
}

let alias = "@"

/**
 * A plugin to resolve the at sign alias from our code or the code of the site
 * Shadcn alias: https://ui.shadcn.com/docs/installation/vite#update-viteconfigts
 */
export function viteAtSrcAliasCascadingResolution(): Plugin {
    let interactConfig = getInteractConfig()
    console.log("at alias resolution plugin loaded")
    return {
        name: 'cascade-alias',
        // importer: the absolute path of the file that contains the import.
        /**
         * https://github.com/rolldown/rolldown/blob/3e4eaa0a919bbd36db14ff6fffa448e28505e002/packages/rolldown/src/plugin/index.ts#L272
         * source example: @/lib/utils as seen in the import
         * importer: /home/admin/code/combostrap/interact/src/lib/components/Avatar.tsx
         */
        resolveId(source, importer) {
            if (!source.startsWith('@/')) return null
            if (importer == null) return null;

            // strip `@/`
            let relative = source.slice(alias.length + 1)
            // delete extension if any
            let lastPoint = relative.lastIndexOf(".")
            if (lastPoint != -1) {
                relative = relative.slice(0, lastPoint)
            }
            // Just the import path is not enough
            let candidates = [];
            let resolution = interactConfig.layout.atAliasResolution;
            let interactPath = `${interactConfig.paths.resourcesDirectory}/${relative}`;
            let clientPath = `${interactConfig.paths.rootDirectory}/src/${relative}`;
            if (resolution == 'standard') {
                if (isInteractAlias(importer)) {
                    candidates.push(interactPath)
                } else {
                    candidates.push(clientPath);
                }
            } else {
                // cascade
                candidates.push(clientPath);
                candidates.push(interactPath)
            }
            // try common extensions
            for (const candidate of candidates) {
                for (const ext of ['', '.ts', '.tsx', '.js', '.jsx']) {
                    let candidateFull = candidate + ext;
                    if (fs.existsSync(candidateFull)) {
                        return candidateFull
                    }
                }
            }
            // let Vite handle it (will likely error)
            console.error(`The ${source} could not be resolved from the importer (${importer}) with the candidate (${candidates.join(', ')}) in ${resolution} resolution`);
            return null
        }
    }
}