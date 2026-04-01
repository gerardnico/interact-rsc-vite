/**
 * The default user rehype and remark configuration
 */
import remarkGfm from "remark-gfm";
import type {InteractMarkdownConfig} from "@combostrap/interact/types";

export const markdownConfig: InteractMarkdownConfig = {
    remarkPlugins: [
        remarkGfm // Table
    ],
    rehypePlugins: []
}
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default markdownConfig;