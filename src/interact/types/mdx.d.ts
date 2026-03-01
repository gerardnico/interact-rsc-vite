import type {ComponentType} from 'react';

interface TocEntry {
    value: string;
    depth: number;
    data?: Record<string, unknown>;
    children?: TocEntry[];
}

interface MarkdownFrontmatter {
    title?: string;
    description?: string;
    layout?: string;
    [key: string]: string;
}

export interface PageModule {
    frontmatter?: MarkdownFrontmatter;
    toc?: TocEntry[];
    default: ComponentType
}

declare module '*.mdx' {
    const defaultType: ComponentType;
    const frontmatter: MarkdownFrontmatter;
    const toc: TocEntry[];
    export {frontmatter, toc};
    export default defaultType;
}