/**
 * The default user rehype and remark configuration
 */
import remarkGfm from "remark-gfm";
import type {InteractMarkdownConfig} from "./markdownConfig.js";


// noinspection JSUnusedGlobalSymbols - imported via vite aliasing
export const markdownConfig: InteractMarkdownConfig = {
    remarkPlugins: [
        remarkGfm // Table
    ],
    rehypePlugins: []
}
export default markdownConfig;