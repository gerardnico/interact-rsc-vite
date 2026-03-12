import remarkFrontmatter from "remark-frontmatter";
import rehypeMdxToc from "@stefanprobst/rehype-extract-toc/mdx";
import type {PluggableList} from "unified";
import rehypeSlug from "rehype-slug";
import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/**
 * Mandatory unified plugin
 * for the outline, toc and heading management
 */
export const mandatoryUnifiedPlugins = {
    markdown: {
        remarkPlugins: [
            [remarkFrontmatter, 'yaml'],
        ] satisfies PluggableList,
        rehypePlugins: [
            // Toc Extraction:
            // Se recommendation here: https://github.com/orgs/mdx-js/discussions/2085
            // needs slug and extract toc
            rehypeSlug, // id to headings
            rehypeExtractToc
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