/**
 * Type for a module that represents a page
 */

import type {ComponentType, ReactElement, ReactNode} from "react";
import type {ContextProps} from "../componentsProvider/contextProps.js";

export type PageComponent = ComponentType<ContextProps>

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
    lead?: string;
    // do we show an hero
    hero?: boolean;
    description?: string;
    layout?: string;
    // keywords for search
    keyWords?: string;
    robots?: string;
    // order in a list
    order?: number;
    // group in a list
    group?: string;
    // 2 letters lang
    lang?: string;
} & Record<string, string | undefined>


/**
 * The page meta
 */
export type PageMeta<F = unknown, D = unknow> = {
    frontmatter?: F & Frontmatter;
    toc?: TocNode[];
};

/**
 * A page module that the middleware should return
 * It exports optionally a frontmatter and a toc
 * Frontmatter is generic
 */
export type Page<F = unknown, D = unknow> = PageMeta<F, D> & {
    default: PageComponent;
};

/**
 * After receiving the page component, we split the content and head elements
 * for head hoisting
 */
export type PageElements = {
    /** The original tree with meta/script elements removed */
    contentElement: ReactNode;
    /** Collected meta and script elements to place in <head> */
    headElements: ReactElement[];
}

/**
 * The page pass to the layout
 */
type FinalPage<F = unknown, D = unknow> = PageMeta<F, D> & PageElements

