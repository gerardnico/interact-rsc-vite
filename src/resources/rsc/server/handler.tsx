import fs from "fs";
import path from "path";

import Holy from "@combostrap/interact/components/layouts/Holy";

import {getInteractConfig} from "@combostrap/interact/config";
import createMiddlewarePipeline from "./handlerPipeline";
import {middlewares} from "interact:middleware-registry"
import {InteractErrorData, InteractError} from "../../../interact/errors"
import {getLayoutComponent} from "interact:layouts";
import type {ContextProps} from "../../../interact/componentsProvider/contextProps";
import type {ReactNode} from "react";
import type {FinalPage, Page} from "../../../interact/pages/interactPage";
import {hoistHeadElements} from "@/rsc/server/headElementHoisting";
import * as NotFound from "@/components/pages/NotFound";

export interface PageFile {
    path: string;
    name: string;
}

const middlewarePipeline = createMiddlewarePipeline();
middlewares.forEach(middleware => middlewarePipeline.use(middleware))

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
 * @param contextProps - the context
 */
export async function getRootResponse(contextProps: ContextProps): Promise<ReactNode | Response> {

    let middlewareResponse = await middlewarePipeline.run(contextProps);
    if (middlewareResponse instanceof Response) {
        return middlewareResponse;
    }

    if (middlewareResponse == null) {
        contextProps.response.status = 404;
        let interactConfig = getInteractConfig();
        middlewareResponse = await middlewarePipeline.run({
            ...contextProps,
            url: new URL(interactConfig.middleware.notFoundPath, 'http://not-found.local'),
        });
        if (middlewareResponse instanceof Response) {
            return middlewareResponse;
        }
        if (middlewareResponse == null) {
            middlewareResponse = NotFound;
        }
    }

    let pageResponse: Page = middlewareResponse

    /**
     * Check that the default export is not null
     */
    if (pageResponse.default == null) {
        throw new InteractError(InteractErrorData.PageWithNullAsDefault)
    }

    /**
     * Extract Meta, link and script element
     */
    const pageElements = hoistHeadElements(<pageResponse.default {...contextProps}/>);

    let page: FinalPage = {
        contentElement: pageElements.contentElement,
        headElements: pageElements.headElements,
        frontmatter: pageResponse.frontmatter,
        toc: pageResponse.toc,
        derived: pageResponse.derived,
    }

    /**
     * Layout
     */
    let layout = "holy"
    let frontMatterLayout = pageResponse.frontmatter?.layout;
    if (frontMatterLayout) {
        layout = frontMatterLayout
    }
    const normalizedLayout = layout.toLowerCase().replace("-", "")

    /**
     * No layout at all, the page returns the HTML root tag
     */
    if (layout === "none") {
        const InteractPageComponent = pageResponse.default
        return <InteractPageComponent {...contextProps}/>
    }

    let Layout = getLayoutComponent(normalizedLayout);
    if (Layout == null) {
        Layout = Holy;
        console.error(`Frontmatter layout ${layout} not found, holy layout was used instead`)
    }
    return <Layout page={page} context={contextProps}/>

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