import type {PageModule} from "@combostrap/interact/client";
import path from "node:path";
import {fsGetTextAsync} from "../utils/fs.js";

import type {CmsMiddlewareHandlerType} from "./cmsMiddleware.js";
import interactMd from "../markdown/processing/interactMd.js";


export async function handler({pagesDirectory}: {
    pagesDirectory: string
}): Promise<CmsMiddlewareHandlerType> {
    const pagesDir = pagesDirectory;


    return async function (request: Request): Promise<PageModule | undefined> {

        let url = new URL(request.url)
        // it's path.join and not path.resolve because pathname is an absolute path
        // resolve will return the second path untouched if it's an absolute path
        let page = path.join(pagesDir, `${url.pathname}.md`)
        let content = await fsGetTextAsync(page);
        if (content == null) {
            return;
        }
        return interactMd.process(content);

    }
}