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
    // no page header / hero
    layoutHeroDisabled?: string;
    // keywords for search
    keyWords?: string;
    robots?: string;
    // order in a list
    order?: number;
    // group in a list
    group?: string;
    // iso string
    lastModified?: string;
    // 2 letters lang
    lang?: string;
} & Record<string, string | undefined>

/**
 * A page module exports optionally a frontmatter and a toc
 * Frontmatter is generic
 */
type Page<F = unknown> = {
    frontmatter?: F & Frontmatter;
    toc?: TocNode[];
    default: PageComponent;
};

