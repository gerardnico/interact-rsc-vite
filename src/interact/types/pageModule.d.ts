/**
 * Type for a module that represents a page
 */

import type {ComponentType} from "react";

export type PageModuleComponent = ComponentType<{ request: Request }>

export interface TocEntry {
    value: string;
    depth: number;
    data?: Record<string, unknown>;
    children?: TocEntry[];
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
export interface PageModule {
    frontmatter?: Frontmatter;
    toc?: TocEntry[];
    default: PageModuleComponent;
}

declare module '*.mdx' {
    const defaultType: ComponentType;
    export const frontmatter: Frontmatter;
    export const toc: TocEntry[];
    export default defaultType;
}

/**
 * All tsx file in pages directory are
 */
declare module "*/pages/*.tsx" {
    const module: PageModuleComponent;
    export const frontmatter: Frontmatter | undefined;
    export const toc: TocEntry[] | undefined;
    export default module.default;
}


declare module "*/pages/*.jsx" {
    const module: PageModuleComponent;
    export const frontmatter: Frontmatter | undefined;
    export const toc: TocEntry[] | undefined;
    export default module.default;
}
