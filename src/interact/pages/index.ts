import fs from "fs";
import path from "path";

/**
 * Directory of all pages
 */
export let pagesDir = "./apps/app/pages"

// @ts-ignore
import Index from "../../../apps/app/pages/index.mdx"
// @ts-ignore
import Counter from "../../../apps/app/pages/counter.mdx"
// @ts-ignore
import Yolo from "../../../apps/app/pages/yolo/yolo.mdx"
import NotFound from "../layout/NotFound"

export interface PageFile {
    path: string;
    name: string;
}

export function getPagesRecursively(dir: string, startDir: string = dir): Record<string, PageFile> {
    const results: Record<string, PageFile> = {};

    function walk(currentDir: string): void {
        const entries = fs.readdirSync(currentDir, {withFileTypes: true});

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                walk(fullPath);
                continue
            }
            const ext = path.extname(entry.name);
            const withoutExt = ext ? fullPath.slice(0, -ext.length) : fullPath;
            const relativePath = path.relative(startDir, withoutExt);
            let keyPath = "/" + relativePath;
            results[keyPath] = {
                name: path.basename(relativePath),
                path: keyPath,
            };
        }
    }

    walk(dir);
    return results;
}

export function getComponent(url: URL): React.FC {

    switch (url.pathname) {
        case "/":
        case "/index":
            return Index
        case "/counter":
            return Counter
        case "/yolo/yolo":
            return Counter
        default:
            console.log("Not found: " + url.pathname)
            return NotFound
    }
}

/**
 * We export it so that static rendering (SSG)
 * can use it to render each page
 */
export function getStaticPaths() {
    return Object.keys(getPagesRecursively(pagesDir))
}

export function getPages() {
    return getPagesRecursively(pagesDir)
}