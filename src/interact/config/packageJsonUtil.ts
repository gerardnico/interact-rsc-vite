import fs, {existsSync} from 'fs'
import path, {dirname, join} from 'path'
import {fileURLToPath} from "node:url";

/**
 * Finds the directory of the last `package.json` toward the root.
 * i.e. the top-most ancestor directory that contains a package.json.
 *
 * @param startDir - the starting directory
 * @param firstAncestor - if last return the last ancestor (up to the root)
 * @returns {string|null} - Absolute path of the top-most dir with package.json, or null if none found.
 */
export function getPackageJsonDir({startDir = process.cwd(), firstAncestor = true}: {
    startDir: string | undefined,
    firstAncestor: boolean
}): string | undefined {

    let current = startDir;
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
    const __filename = fileURLToPath(import.meta.url);
    let startDir = path.dirname(__filename);
    let packageJsonPath = path.resolve(getPackageJsonDir({startDir, firstAncestor: true}) + "/package.json")
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson;
}


