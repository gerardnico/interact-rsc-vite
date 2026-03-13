/**
 * Type for a module that represents a page
 */

import type {ComponentType} from "react";

export type PageComponent = ComponentType<{ request: Request }>

export interface TocNode {
    value: string;
    depth: number;
    id: string;
    data?: Record<string, unknown>;
    children?: TocNode[];
}

export interface Frontmatter {
    name?: string;
    title?: string;
    description?: string;
    layout?: string;
    keyWords?: string;
    robots?: string;

    [key: string]: string;
}

/**
 * A page module exports optionally a frontmatter and a toc
 */
export interface Page {
    frontmatter?: Frontmatter;
    toc?: TocNode[];
    default: PageComponent;
}

declare module '*.mdx' {
    const defaultType: ComponentType;
    export const frontmatter: Frontmatter;
    export const toc: TocNode[];
    export default defaultType;
}

declare module '*.md' {
    const defaultType: ComponentType;
    export const frontmatter: Frontmatter;
    export const toc: TocNode[];
    export default defaultType;
}

/**
 * All tsx file in pages directory are
 */
declare module "*/pages/*.tsx" {
    const module: PageComponent;
    export const frontmatter: Frontmatter | undefined;
    export const toc: TocNode[] | undefined;
    export default module.default;
}


declare module "*/pages/*.jsx" {
    const module: PageComponent;
    export const frontmatter: Frontmatter | undefined;
    export const toc: TocNode[] | undefined;
    export default module.default;
}
