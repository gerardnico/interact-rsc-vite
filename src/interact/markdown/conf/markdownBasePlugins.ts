import remarkFrontmatter from "remark-frontmatter";
import rehypeMdxToc from "@stefanprobst/rehype-extract-toc/mdx";
import type {PluggableList} from "unified";
import rehypeSlug from "rehype-slug";
import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeHrefRewrite from "../plugins/rehype-href-rewrite.js";
import type {InteractConfigType} from "../../config/configHandler.js";
import path from "node:path";
import remarkLocalLinkChecker from "../plugins/remark-local-link-checker.js";

/**
 * Mandatory unified plugin
 * for the outline, toc and heading management
 */
export function getMandatoryUnifiedPlugins(interactConfig: InteractConfigType) {
    const basePublicName = path.basename(interactConfig.paths.publicDirectory)

    return {
        markdown: {
            remarkPlugins: [
                [remarkFrontmatter, 'yaml'],
                [
                    remarkLocalLinkChecker,
                    {
                        pagesDir: interactConfig.paths.pagesDirectory
                    }
                ]
            ] satisfies PluggableList,
            rehypePlugins: [
                // Toc Extraction:
                // Se recommendation here: https://github.com/orgs/mdx-js/discussions/2085
                // needs slug and extract toc
                rehypeSlug, // id to headings
                rehypeExtractToc,
                [
                    rehypeHrefRewrite,
                    {
                        publicDirName: basePublicName,
                        base: interactConfig.site.base
                    }
                ],
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
    }
};