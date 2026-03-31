import fs from "fs";
import path from "path";

import Holy from "@combostrap/interact/components/layouts/Holy";

import getPageModule from 'interact:page-modules';
import {getInteractConfig} from "@combostrap/interact/config";
import {NotFound} from "interact:components";
import createMiddlewarePipeline from "./middlewareHandlerPipeline";
import {middlewares} from "interact:middleware-registry"
import type {ReactNodeResponse} from "../../../interact/middlewareEngine/interactMiddleware.js";
import {InteractErrorData, InteractError} from "../../../interact/errors"
import {getLayoutComponent} from "interact:layouts";

export interface PageFile {
    path: string;
    name: string;
}

const pageProviderPipeline = createMiddlewarePipeline();
middlewares.forEach(middleware => pageProviderPipeline.use(middleware))

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


async function getPageResponse(normalizedRequest: Request) {

    let url = new URL(normalizedRequest.url)

    /**
     * Get a page module (jsx, tsx, ts, js, mdx)
     */
    let page = getPageModule({path: url.pathname});
    if (page != null) {
        return {
            page: page
        }
    }

    /**
     * Object Page Provider Module?
     */
    return await pageProviderPipeline.run(normalizedRequest);

}

/**
 * The root component should return the entire document including the root <html> tag.
 * See https://react.dev/reference/react-dom/server/renderToReadableStream#usage
 * @param normalizedRequest - the request with the URL without the rsc suffix
 */
export async function getRootResponse(normalizedRequest: Request): Promise<ReactNodeResponse | Response> {


    let middlewareResponse = await getPageResponse(normalizedRequest);
    if (middlewareResponse instanceof Response) {
        return middlewareResponse;
    }
    let pageResponse = middlewareResponse;

    if (pageResponse == null) {
        pageResponse = {
            status: 404,
            page: NotFound
        };
    }

    /**
     * Check that the default export is not null
     */
    if (pageResponse.page.default == null) {
        throw new InteractError(InteractErrorData.PageWithNullAsDefault)
    }

    /**
     * Layout
     */
    let layout = "holy"
    let frontMatterLayout = pageResponse.page?.frontmatter?.layout;
    if (frontMatterLayout) {
        layout = frontMatterLayout
    }
    const normalizedLayout = layout.toLowerCase().replace("-", "")

    /**
     * No layout at all, the page returns the HTML root tag
     */
    if (layout === "none") {
        const InteractPageComponent = pageResponse.page.default
        return {
            status: pageResponse.status,
            headers: pageResponse.headers,
            root: <InteractPageComponent request={normalizedRequest}/>
        }
    }

    let Layout = getLayoutComponent(normalizedLayout);
    if (Layout == null) {
        Layout = Holy;
        console.error(`Frontmatter layout ${layout} not found, holy layout was used instead`)
    }
    return {
        status: pageResponse.status,
        headers: pageResponse.headers,
        root: <Layout page={pageResponse.page} request={normalizedRequest}/>
    }

}

/**
 * We export it so that static rendering (SSG)
 * can use it to render each page
 */
export function getStaticPaths() {
    return Object.keys(getPagesRecursively(getInteractConfig().paths.pagesDirectory))
}


export function getPages() {
    let interactConfig = getInteractConfig();
    let pages = getPagesRecursively(interactConfig.paths.pagesDirectory)

    /**
     * Delete the 404 pages if set
     */
    let importPath = interactConfig.components?.NotFound?.importPath;
    if (importPath != null) {
        let pagesWord = "pages";
        let indexOf = importPath.indexOf(pagesWord);
        if (indexOf != -1) {
            let notFoundPath = importPath.slice(indexOf + pagesWord.length);
            const extensionIndex = notFoundPath.indexOf(".");
            if (extensionIndex != -1) {
                notFoundPath = notFoundPath.slice(0, extensionIndex);
            }
            delete pages[notFoundPath];
        }
    }


    return pages
}