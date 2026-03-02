import {existsSync} from 'fs'
import {dirname, join} from 'path'
import {fileURLToPath} from "node:url";
import path from "path";
import fs from "fs";

/**
 * Finds the directory of the last `package.json` toward the root.
 * i.e. the top-most ancestor directory that contains a package.json.
 *
 * @param {string} startDir - Directory to start searching from.
 * @param firstAncestor - if last return the last ancestor (up to the root)
 * @returns {string|null} - Absolute path of the top-most dir with package.json, or null if none found.
 */
export function getPackageJsonDir(startDir: string, firstAncestor: boolean = true) {
    let current = startDir
    let result: string | undefined

    while (true) {
        if (existsSync(join(current, 'package.json'))) {
            result = current // Keep overwriting — last one wins
            if (firstAncestor) {
                break
            }
        }

        const parent = dirname(current)

        if (parent === current) break // Reached filesystem root

        current = parent
    }

    return result
}

let packageJson;

export function getInteractPackageJson() {
    if (packageJson != undefined) {
        return packageJson;
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    let packageJsonPath = path.resolve(getPackageJsonDir(__dirname, true) + "/package.json")
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson;
}
