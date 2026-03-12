import remarkGfm from "remark-gfm";
import type {InteractMarkdownConfigType} from "@interact/markdown-config";

// noinspection JSUnusedGlobalSymbols - imported via vite aliasing
export const markdownConfig: InteractMarkdownConfigType = {
    remarkPlugins: [
        remarkGfm // Table
    ],
    rehypePlugins: []
}
export default markdownConfig;