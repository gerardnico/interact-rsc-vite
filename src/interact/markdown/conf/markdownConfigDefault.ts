import remarkGfm from "remark-gfm";
import type {PluggableList} from "unified";


// noinspection JSUnusedGlobalSymbols - imported via vite aliasing
export const markdownConfig: InteractMarkdownConfigType = {
    remarkPlugins: [
        remarkGfm // Table
    ],
    rehypePlugins: []
}
export default markdownConfig;