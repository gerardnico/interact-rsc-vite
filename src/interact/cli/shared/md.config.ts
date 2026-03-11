import remarkFrontmatter from "remark-frontmatter";
import remarkMdxToc from "@altano/remark-mdx-toc-with-slugs";
import remarkGfm from 'remark-gfm';
import type {PluggableList} from "unified";


export const unifiedPlugins = {
    remarkPlugins: [
        [remarkFrontmatter, 'yaml'], // a plugin with option
        //remarkMdxFrontmatter, // exports frontmatter as `frontmatter`
        remarkMdxToc, // exports headings as `toc`
        remarkGfm // Table
    ] satisfies PluggableList,
    rehypePlugins: [],
};