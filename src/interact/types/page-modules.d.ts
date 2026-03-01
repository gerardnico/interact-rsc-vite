import type {ComponentType} from "react";
import type {MarkdownFrontmatter, TocEntry} from "./index";

export interface PageModule {
    frontmatter?: MarkdownFrontmatter;
    toc?: TocEntry[];
    default: ComponentType
}

declare module 'virtual:page-modules' {

    /**
     * Look up a page module by route path.
     *
     * @param opts.path          - The route to look up, e.g. `"/page1"`.
     * @param opts.notFoundPath  - Fallback route if `path` is not found.
     */
    export function getModulePage(opts: {
        path: string;
        notFoundPath?: string;
    }): PageModule | undefined;

    /** All registered route → module mappings. */
    export const modulePages: Record<string, PageModule>;
    export default getModulePage;
}