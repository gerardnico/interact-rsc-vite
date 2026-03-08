import fs from "fs";
import path from "path";

import Holy from "#components/Holy";
import Landing from "../components/Landing/Landing.js";
import * as NotFoundModule from "../components/NotFound/NotFound.js";

import getModulePage from 'interact:page-modules';
import {interactConfig} from "interact:config";
import type {InteractConfigType} from "../config/configSchema.js";
/**
 * Otherwise we don't get any TypeScript error
 */
let interactConfigTyped = interactConfig as InteractConfigType;

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

/**
 * The root component should return the entire document including the root <html> tag.
 * See https://react.dev/reference/react-dom/server/renderToReadableStream#usage
 * @param normalizedRequest - the request with the URL without the rsc suffix
 */
export function getRootComponent(normalizedRequest: Request): React.JSX.Element {

    let url = new URL(normalizedRequest.url)
    /**
     * Get a page module
     */
    let pageModule = getModulePage({path: url.pathname});

    if (!pageModule) {
        pageModule = NotFoundModule;
    }
    /**
     * Layout
     */
    let layout = "holy"
    let frontMatterLayout = pageModule?.frontmatter?.layout?.toLowerCase();
    if (frontMatterLayout) {
        layout = frontMatterLayout
    }
    let Layout
    switch (layout) {
        case "holy": {
            Layout = Holy
            break
        }
        case "landing": {
            Layout = Landing
            break;
        }
        default: {
            Layout = Holy;
            console.log("Layout not found: " + layout)
        }
    }

    return <Layout pageModule={pageModule} request={normalizedRequest}/>

}

/**
 * We export it so that static rendering (SSG)
 * can use it to render each page
 */
export function getStaticPaths() {
    return Object.keys(getPagesRecursively(interactConfigTyped.paths.pagesDirectory))
}


export function getPages() {
    return getPagesRecursively(interactConfigTyped.paths.pagesDirectory)
}