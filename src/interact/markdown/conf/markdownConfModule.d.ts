/**
 * Definition of the Vite alias module
 */
declare module '@interact/markdown-config' {

    import type {PluggableList} from "unified";

    type InteractMarkdownConfigType = {
        remarkPlugins?: PluggableList
        rehypePlugins?: PluggableList
    }

    export const markdownConfig: InteractMarkdownConfigType;

}