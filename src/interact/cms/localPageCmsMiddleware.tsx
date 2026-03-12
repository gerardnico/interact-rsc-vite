import type {PageModule} from "@combostrap/interact/client";
import path from "node:path";
import {fsGetTextAsync} from "../utils/fs.js";

import type {CmsMiddlewareHandlerType} from "./cmsMiddleware.js";
import interactMd from "../markdown/processing/interactMd.js";
import {VFile} from "vfile";


// noinspection JSUnusedGlobalSymbols - loaded dynamically via alias
export async function handler({pagesDirectory}: {
    pagesDirectory: string
}): Promise<CmsMiddlewareHandlerType> {
    const pagesDir = pagesDirectory;

    return async function (request: Request): Promise<PageModule | undefined> {

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
        return interactMd.process(file);

    }
}