declare module 'interact:page-modules' {
    import type { ComponentType } from "react";
    import type { MarkdownFrontmatter, TocEntry } from "./mdx";

    export interface PageModule {
        frontmatter?: MarkdownFrontmatter;
        toc?: TocEntry[];
        default: ComponentType;
    }

    export function getModulePage(opts: {
        path: string;
        notFoundPath?: string;
    }): PageModule | undefined;

    export const modulePages: Record<string, PageModule>;
    export default getModulePage;
}