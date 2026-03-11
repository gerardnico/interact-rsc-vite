import remarkFrontmatter from "remark-frontmatter";
import rehypeMdxToc from "@stefanprobst/rehype-extract-toc/mdx";
import remarkGfm from 'remark-gfm';
import type {PluggableList} from "unified";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import {h} from 'hastscript'
import {toString} from 'hast-util-to-string'
import type {Nodes} from "hast";

export const unifiedPlugins = {
    markdown: {
        remarkPlugins: [
            [remarkFrontmatter, 'yaml'], // a plugin with option
            // remarkMdxToc, // exports headings as `toc`
            remarkGfm // Table
        ] satisfies PluggableList,
        rehypePlugins: [
            // Toc Extraction:
            // Se recommendation here: https://github.com/orgs/mdx-js/discussions/2085
            // needs slug and extract toc
            rehypeSlug, // id to headings
            rehypeExtractToc,
            [rehypeAutolinkHeadings, {
                behavior: 'wrap',
                content(nodes: Nodes) {
                    return [
                        h('span.visually-hidden', 'Read the “', toString(nodes), '” section'),
                        h('i.bi.bi-link-45deg', {ariaHidden: 'true'})
                    ]
                }
            }] // add link to headings themselves
        ] satisfies PluggableList,
    },
    mdx: {
        rehypePlugins: [
            [rehypeMdxToc, {name: 'toc'}],
        ] satisfies PluggableList,
        remarkPlugins: [
            remarkMdxFrontmatter, // exports frontmatter as `frontmatter`
        ] satisfies PluggableList,
    }
};