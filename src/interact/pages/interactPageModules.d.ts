/**
 * Adding the frontmatter and toc exports as explained here:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b4043de9a862ce2e1eafc0ea0cd79e9b25972ed7/types/mdx/index.d.ts#L53
 */
declare module '*.mdx' {
    import type {Frontmatter, TocNode} from "@combostrap/interact/types";
    export const frontmatter: Frontmatter;
    export const toc: TocNode[];
    // The default export of MDX files is a function which takes props and returns a JSX element.
    // export default function MDXContent(props: MDXProps): Element;
}

declare module '*.md' {
    import type {Frontmatter, TocNode} from "@combostrap/interact/types";
    export const frontmatter: Frontmatter;
    export const toc: TocNode[];
    // changing the default is not allowed?
    // The default export of MDX files is a function which takes props and returns a JSX element.
    // export default function MDXContent(props: MDXProps): Element;
}

/**
 * All tsx file in pages directory are
 */
declare module "pages/*.tsx" {
    import type {Frontmatter, TocNode} from "@combostrap/interact/types";
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
