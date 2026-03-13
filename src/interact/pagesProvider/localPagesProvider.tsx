import type {Page} from "@combostrap/interact/types";
import path from "node:path";
import {fsGetTextAsync} from "../utils/fs.js";

import type {PagesHandler} from "../pagesProviderManager/pagesProvider.js";
import interactMarkdown from "@combostrap/interact/markdown";
import {VFile} from "vfile";


/**
 * A pages middleware handler that returns pages from Markdown file located in a local directory
 */
// noinspection JSUnusedGlobalSymbols - loaded dynamically via alias
export async function handler({pagesDirectory}: {
    pagesDirectory: string
}): Promise<PagesHandler> {
    const pagesDir = pagesDirectory;

    return async function (request: Request): Promise<Page | undefined> {

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
        return interactMarkdown.toPage(file);

    }
}