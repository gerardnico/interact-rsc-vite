import type {PageModule} from "@combostrap/interact/client";
import path from "node:path";
import {fsGetTextAsync} from "../utils/fs.js";
import remarkRehype from "remark-rehype";
import remarkParse from "remark-parse";
import {unified} from "unified";
import {createElement, Fragment} from "react";
import rehypeReact from "rehype-react";
import {jsx, jsxs} from "react/jsx-runtime";
import type {CmsMiddlewareHandlerType} from "./cmsMiddleware.js";
import type {MDXComponents} from "mdx/types.js";
import {unifiedPlugins} from "../cli/shared/md.config.js";
import type {Root} from "mdast";
import YAML from 'yaml'

export async function handler({pagesDirectory, strictYamlParsing = false}: {
    pagesDirectory: string,
    strictYamlParsing: boolean,
}): Promise<CmsMiddlewareHandlerType> {
    let settings = unifiedPlugins || {}
    let components: MDXComponents | null = {};
    const pagesDir = pagesDirectory;

    // components
    // The providerImportSource is a virtual module, so we need to instantiate it
    // at the first request
    // if (components == null) {
    //     let providerImportSource = settings.providerImportSource;
    //     if (providerImportSource != null) {
    //         const mod = await import(providerImportSource)
    //         if (typeof mod.useMDXComponents === 'function') {
    //             components = mod.useMDXComponents()
    //         }
    //     } else {
    //         components = {}
    //     }
    // }


    return async function (request: Request): Promise<PageModule | undefined> {

        let url = new URL(request.url)
        // it's path.join and not path.resolve because pathname is an absolute path
        // resolve will return the second path untouched if it's an absolute path
        let page = path.join(pagesDir, `${url.pathname}.md`)
        let content = await fsGetTextAsync(page);
        if (content == null) {
            return;
        }
        content = content.replace("<!--", "{/*")
        content = content.replace("-->", "*/}")
        // We installed rehypeReact because Mdx use rehypeRecma as compiler (ie the hast goes to the JavaScript Tree)
        // https://github.com/mdx-js/mdx/blob/af23c2d18b58467db567b7afe78d7492bb4ea4bc/packages/mdx/lib/core.js#L161
        let frontmatter = {}
        const vFile = await unified()
            .use(remarkParse)           // Parse markdown into mdast
            .use(settings.markdown.remarkPlugins || [])
            .use(function () {
                /**
                 * Capture Frontmatter
                 * The order is important because the Yaml node disappears
                 * at the end of the pipeline
                 */
                return function (tree: Root) {
                    for (const node of tree.children) {
                        if (node?.type == 'yaml') {
                            frontmatter = YAML.parse(node.value, {strict: strictYamlParsing});
                        }
                    }
                }
            })
            .use(remarkRehype, {        // mdast → hast
                allowDangerousHtml: false,
                // only
                //passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement']
            })
            .use(settings.markdown.rehypePlugins || [])
            .use(rehypeReact, {         // hast → React element tree
                createElement,
                Fragment,
                jsx,
                jsxs,
                // -----------------------------------------------------------------------
                // 2. Optional: map hast element names to custom React components.
                //    Swap these out for your own component library as needed.
                // -----------------------------------------------------------------------
                components: components
            }).process(content);
        return {
            frontmatter: frontmatter,
            toc: vFile.data?.toc || {},
            default: () => {
                return vFile.result
            }
        }
    }
}