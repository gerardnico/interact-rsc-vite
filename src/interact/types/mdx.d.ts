import type {ComponentType} from 'react';

interface TocEntry {
    value: string;
    depth: number;
    data?: Record<string, unknown>;
    children?: TocEntry[];
}

interface MarkdownFrontmatter {
    name?: string;
    title?: string;
    description?: string;
    layout?: string;
    keyWords?:string;
    robots?:string;
    [key: string]: string;
}


declare module '*.mdx' {
    const defaultType: ComponentType;
    const frontmatter: MarkdownFrontmatter;
    const toc: TocEntry[];
    export {frontmatter, toc};
    export default defaultType;
}