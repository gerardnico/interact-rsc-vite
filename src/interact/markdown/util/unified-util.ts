import type { Element, Properties } from 'hast'
export interface HastImgElement extends Element {
    tagName: 'img'
    properties: Properties & {
        src?: string
        alt?: string
        width?: number | string
        height?: number | string
    }
}

/**
 * The doc is only for remark, not rehype.
 * https://unifiedjs.com/learn/recipe/tree-traversal-typescript/
 * rehype do not have type coercion.
 * so we do
 */
export function isHastImgElement(node: Element): node is HastImgElement {
    return node.tagName === 'img'
}

export interface HastAnchorElement extends Element {
    tagName: 'a'
    properties: Properties & {
        href?: string
        target?: string
        rel?: string | string[]
        title?: string
        download?: boolean | string
        hrefLang?: string
        ping?: string | string[]
        referrerPolicy?: string
        type?: string
        // aria
        ariaLabel?: string
        ariaDescribedBy?: string
    }
}

/**
 * The doc is only for remark, not rehype.
 * https://unifiedjs.com/learn/recipe/tree-traversal-typescript/
 * rehype do not have type coercion.
 * so we do
 */
export function isHastAnchorElement(node: Element): node is HastAnchorElement {
    return node.tagName === 'a'
}

/**
 * Remove the part of public in a href or src path
 * And returns an absolute path if absolute is true
 *
 * Img path should be absolute
 * While Anchor link should not
 * @param publicDirName - the name of the public directory
 * @param relativePath - the relative path
 * @param absolute = return an absolute path if true
 */
export function removePublicPart({relativePath, publicDirName = "public", absolute = false}: {
    relativePath: string,
    publicDirName?: string,
    absolute?: boolean
}): string {
    let searchString = `/${publicDirName}/`;
    const publicIndex = relativePath.indexOf(searchString)

    if (publicIndex == -1) {
        return relativePath
    }
    let sliceStart = publicIndex + searchString.length;
    if (absolute) {
        // keep also the separator character
        sliceStart -= 1
    }
    return relativePath.slice(sliceStart);
}