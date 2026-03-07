declare module 'interact:page-modules' {
    import type { ComponentType } from "react";
    import type { MarkdownFrontmatter, TocEntry } from "./mdx";

    export type PageModuleComponent = ComponentType<{ request: Request }>

    export type PageModule = {
        frontmatter?: MarkdownFrontmatter;
        toc?: TocEntry[];
        default: PageModuleComponent;
    }

    export function getModulePage(opts: {
        path: string;
        notFoundPath?: string;
    }): PageModule | undefined;

    export const modulePages: Record<string, PageModule>;
    export default getModulePage;
}