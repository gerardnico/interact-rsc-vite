import fs from "fs";
import path from "path";

import Holy from "#components/Holy";

import getPageModule from 'interact:page-modules';
import {interactConfig} from "interact:config";
import type {InteractConfig} from "@combostrap/interact/types";
import {getLayoutComponent, NotFound} from "interact:components";
import React from "react";
import createPagesProviderPipeline from "../pagesProviderManager/pagesHandlerPipeline.js";
import {pagesProviderHandlers} from "interact:pages-provider-manager"

/**
 * Otherwise we don't get any TypeScript error
 */
let interactConfigTyped = interactConfig as InteractConfig;

export interface PageFile {
    path: string;
    name: string;
}

const pageProviderPipeline = createPagesProviderPipeline();
pagesProviderHandlers.forEach(cm => pageProviderPipeline.use(cm))

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
     * Get a page module (jsx, tsx, ts, js, mdx)
     */
    let page = getPageModule({path: url.pathname});

    if (page == null) {
        /**
         * Object Page Provider Module?
         */
        page = await pageProviderPipeline.run(normalizedRequest);
    }

    if (page == null) {
        page = NotFound;
    }

    /**
     * Layout
     */
    let layout = "holy"
    let frontMatterLayout = page?.frontmatter?.layout;
    if (frontMatterLayout) {
        layout = frontMatterLayout
    }
    const normalizedLayout = layout.toLowerCase().replace("-", "")
    if (layout === "none") {
        // the ! after the page variable is to say that we are sure it's defined
        const InteractPageComponent = page!.default
        return <InteractPageComponent request={normalizedRequest}/>
    }
    let Layout = getLayoutComponent(normalizedLayout);
    if (Layout == null) {
        Layout = Holy;
        console.error(`Frontmatter layout ${layout} not found, holy layout was used instead`)
    }

    return <Layout interactPage={page} request={normalizedRequest}/>

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