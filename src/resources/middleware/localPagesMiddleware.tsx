import path from "node:path";
import {fsGetTextAsync} from "../../interact/utils/fs";

import type {MiddlewareHandler, MiddlewarePageResponse} from "../../interact/middlewareEngine/interactMiddleware";
import {VFile} from "vfile";
import {markdownToPageSync} from "../markdown/interactMarkdownProcessor";


/**
 * A pages middleware handler that returns pages from Markdown file located in a local directory
 */
// noinspection JSUnusedGlobalSymbols - loaded dynamically via alias
export async function handler({pagesDirectory}: {
    pagesDirectory: string
}): Promise<MiddlewareHandler> {
    const pagesDir = pagesDirectory;

    return async function (request: Request): Promise<MiddlewarePageResponse | undefined> {

        let url = new URL(request.url)
        // it's path.join and not path.resolve because pathname is an absolute path
        // resolve will return the second path untouched if it's an absolute path
        let filePath = url.pathname
        if (filePath.endsWith("/")) {
            filePath += "index";
        }
        let page = path.join(pagesDir, `${filePath}.md`)
        let content = await fsGetTextAsync(page);
        if (content == null) {
            return;
        }
        const file = new VFile({
            path: page,
            value: content,
        })
        return {
            page: markdownToPageSync(file)
        };

    }
}