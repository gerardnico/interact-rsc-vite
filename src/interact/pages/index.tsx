import fs from "fs";
import path from "path";

import Holy from "#components/Holy";

import getProgrammaticPageModule from 'interact:page-modules';
import {interactConfig} from "interact:config";
import type {InteractConfigType} from "../config/configHandler.js";
import {getLayoutComponent, NotFound} from "interact:components";
import type {PageModule} from "./pageModule.js";
import React from "react";
import createCmsPipeline from "../cms/cmsPipeline.js";
import {cmsHandlers} from "interact:cms-provider"

/**
 * Otherwise we don't get any TypeScript error
 */
let interactConfigTyped = interactConfig as InteractConfigType;

export interface PageFile {
    path: string;
    name: string;
}

const cmsPipeline = createCmsPipeline();
cmsHandlers.forEach(cm => cmsPipeline.use(cm))

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
export async function getRootComponent(normalizedRequest: Request): Promise<React.ReactNode> {

    let url = new URL(normalizedRequest.url)
    /**
     * Get a programmatic page module (jsx, tsx, ts, js)
     */
    let pageModule: PageModule | undefined = getProgrammaticPageModule({path: url.pathname});

    if (pageModule == null) {
        /**
         * Cms Module?
         */
        pageModule = await cmsPipeline.run(normalizedRequest);
    }

    if (pageModule == null) {
        pageModule = NotFound;
    }

    /**
     * Layout
     */
    let layout = "holy"
    let frontMatterLayout = pageModule?.frontmatter?.layout;
    if (frontMatterLayout) {
        layout = frontMatterLayout
    }
    const normalizedLayout = layout.toLowerCase().replace("-", "")
    let Layout = getLayoutComponent(normalizedLayout);
    if (Layout == null) {
        Layout = Holy;
        console.error(`Frontmatter layout ${layout} not found, holy layout was used instead`)
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