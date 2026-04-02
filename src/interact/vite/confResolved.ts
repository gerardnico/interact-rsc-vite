import path from "node:path";
import fs from "fs";
import type {Plugin} from "vite";
// not @combostrap/interact
import {getInteractConfig} from "../config/interactConfig.js";


/**
 * Store a resolved conf for debugging purpose in dist
 */
export default function confResolved(): Plugin {
    let interact = getInteractConfig();
    return {
        name: 'resolved',
        configResolved(config) {
            const outDir = interact.paths.buildDirectory;
            const outPath = path.resolve(config.root, outDir, 'vite-resolved-config.json')

            /**
             * WeakMap/WeakSet tracking circular by reference (identity)
             * May be circular even for objects
             */
            const seen = new WeakMap()
            const replacer = (key: string, value: any) => {
                if (typeof value === 'function') return '[Function]'
                /**
                 * Print array of value
                 */
                if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                    return value
                }
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        // we pass the key
                        if (seen.has(value)) return `[Circular: ${seen.get(value)}]`
                    }
                    // build the path: use the parent's path + current key
                    const parentPath = seen.get(this) ?? '$'
                    seen.set(value, key ? `${parentPath}.${key}` : parentPath)
                }
                return value
            }
            fs.mkdirSync(path.dirname(outPath), {recursive: true});
            let jsonConfig = JSON.stringify(config, replacer, 2);
            console.log(`Writing resolved config to ${outPath}`);
            fs.writeFileSync(outPath, jsonConfig)
        }
    }
}