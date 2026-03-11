import type {PageModule} from "@combostrap/interact/client";
import {interactConfig} from "interact:config";
import type {InteractConfigType} from "../config/configHandler.js";
import remarkMdxToc from "@altano/remark-mdx-toc-with-slugs";
import path from "node:path";
import {fsGetTextAsync} from "../utils/fs.js";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import {unified} from "unified";
import {createElement, Fragment} from "react";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeReact from "rehype-react";
import {jsx, jsxs} from "react/jsx-runtime";

/**
 * Otherwise we don't get any TypeScript error
 */
let interactConfigTyped = interactConfig as InteractConfigType;

export async function getCmsPage(request: Request): Promise<PageModule | undefined> {
    let url = new URL(request.url)
    let page = path.join(interactConfigTyped.paths.pagesDirectory, `${url.pathname}.md`)
    let content = await fsGetTextAsync(page);
    if (content == null) {
        return;
    }
    content = content.replace("<!--", "{/*")
    content = content.replace("-->", "*/}")
    // ProcessorOptions of mdx
    const settings = {
        remarkPlugins: [
            remarkMdxFrontmatter,
            remarkMdxToc,
            remarkGfm
        ],
        rehypePlugins: []
    }
    // Mdx use rehypeRecma as compiler (The hast goes to Javascript)
    // https://github.com/mdx-js/mdx/blob/af23c2d18b58467db567b7afe78d7492bb4ea4bc/packages/mdx/lib/core.js#L161
    const processor = unified()
        .use(remarkParse)           // Parse markdown into mdast
        .use(settings.remarkPlugins || [])
        .use(remarkMdx)
        .use(remarkRehype, {        // mdast → hast
            allowDangerousHtml: false,
            // only
            //passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement']
        })
        .use(settings.rehypePlugins || [])
        .use(rehypeReact, {         // hast → React element tree
            createElement,
            Fragment,
            jsx,
            jsxs,
            // -----------------------------------------------------------------------
            // 2. Optional: map hast element names to custom React components.
            //    Swap these out for your own component library as needed.
            // -----------------------------------------------------------------------
            components: {
                // Example overrides – delete or replace with your actual components:
                // h1: ({ children }) => <h1 className="text-4xl font-bold">{children}</h1>,
                // code: ({ children, className }) => <pre className={className}>{children}</pre>,
            },
        });
    const vFile = await processor.process(content);
    return {
        frontmatter: {
            layout: "holy"
        },
        default: () => {
            return vFile.result
        }
    }
}