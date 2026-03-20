import fs, {existsSync} from 'fs'
import path, {dirname, join} from 'path'
import {fileURLToPath} from "node:url";

/**
 * Finds the directory of the last `package.json` toward the root.
 * i.e. the top-most ancestor directory that contains a package.json.
 *
 * @param firstAncestor - if last return the last ancestor (up to the root)
 * @returns {string|null} - Absolute path of the top-most dir with package.json, or null if none found.
 */
export function getPackageJsonDir(firstAncestor: boolean = true): string | undefined {
    const __filename = fileURLToPath(import.meta.url);
    let current = path.dirname(__filename);
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

let packageJson: any;

export function getPackageJson() {
    if (packageJson != undefined) {
        return packageJson;
    }
    let packageJsonPath = path.resolve(getPackageJsonDir( true) + "/package.json")
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson;
}


