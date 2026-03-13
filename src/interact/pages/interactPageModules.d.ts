
declare module '*.mdx' {
    import type {Frontmatter, TocNode} from "@combostrap/interact/types";
    import type {ComponentType} from "react";
    const defaultType: ComponentType;
    export const frontmatter: Frontmatter;
    export const toc: TocNode[];
    export default defaultType;
}

declare module '*.md' {
    import type {Frontmatter, TocNode} from "@combostrap/interact/types";
    import type {ComponentType} from "react";
    const defaultType: ComponentType;
    export const frontmatter: Frontmatter;
    export const toc: TocNode[];
    export default defaultType;
}

/**
 * All tsx file in pages directory are
 */
declare module "pages/*.tsx" {
    import type {Frontmatter,  TocNode} from "@combostrap/interact/types";
    import type {ComponentType} from "react";
    const module: ComponentType;
    export const frontmatter: Frontmatter | undefined;
    export const toc: TocNode[] | undefined;
    export default module;
}


declare module "pages/*.jsx" {
    import type {Frontmatter, TocNode} from "@combostrap/interact/types";
    import type {ComponentType} from "react";
    const module: ComponentType;
    export const frontmatter: Frontmatter | undefined;
    export const toc: TocNode[] | undefined;
    export default module;
}
