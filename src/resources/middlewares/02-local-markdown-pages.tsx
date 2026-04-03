import path from "node:path";

import type {MiddlewareHandler} from "../../interact/middlewareEngine/interactMiddleware";
import {VFile} from "vfile";
import {markdownToPageSync} from "../markdown/interactMarkdownProcessor";

import {readFile} from "fs/promises";
import type {ContextProps} from "../../interact/componentsProvider/contextProps";
import type {Page} from "../../interact/pages/interactPage";
import {getInteractConfig} from "../../interact/config/interactConfig";

export async function fsGetTextAsync(path: string) {
    try {
        return await readFile(path, "utf8");
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === "ENOENT") {
            return null; // file does not exist
        }
        throw err;
    }
}

/**
 * A pages middleware handler that returns pages from Markdown file located in a local directory
 */
// noinspection JSUnusedGlobalSymbols - loaded dynamically via alias
export async function handler(): Promise<MiddlewareHandler> {
    let interactConfig = getInteractConfig()
    const pagesDir = interactConfig.paths.pagesDirectory;

    return async function (context: ContextProps): Promise<Page | undefined> {


        // it's path.join and not path.resolve because pathname is an absolute path
        // resolve will return the second path untouched if it's an absolute path
        let filePath = context.url.pathname
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
        return markdownToPageSync(file);

    }
}