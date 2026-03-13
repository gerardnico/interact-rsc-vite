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

export type Frontmatter = {
    name?: string;
    title?: string;
    description?: string;
    layout?: string;
    keyWords?: string;
    robots?: string;
} & Record<string, string | undefined>

/**
 * A page module exports optionally a frontmatter and a toc
 */
export interface Page {
    frontmatter?: Frontmatter;
    toc?: TocNode[];
    default: PageComponent;
}
