import {visit} from "unist-util-visit";
import type {Root} from 'hast'
import {isHastAnchorElement, isHastImgElement, removePublicPart} from "../util/unified-util.js";


function removeMarkdownExtensionAndIndex(url: string) {


    // Extract hash
    const hashIndex = url.indexOf('#');
    const hash = hashIndex !== -1 ? url.slice(hashIndex) : '';
    url = hashIndex !== -1 ? url.slice(0, hashIndex) : url;

    // Extract search
    const searchIndex = url.indexOf('?');
    const search = searchIndex !== -1 ? url.slice(searchIndex) : '';
    const pathname = searchIndex !== -1 ? url.slice(0, searchIndex) : url;

    // Remove .mdx and .md extension from pathname
    let cleanPathname = pathname.replace(/(\.mdx?)$/, "");

    // Remove index name
    cleanPathname = cleanPathname.replace(/(\/index)$/, "/");

    return `${cleanPathname}${search}${hash}`;

}

/**
 * Path does not have the md or mdx extension but the link checker (editor or cli) needs them
 * This plugin will delete the Markdown extension from a link
 *
 * Example:
 * * /docs/getting-started.md → /docs/getting-started
 * * /docs/getting-started.mdx → /docs/getting-started
 * * /docs/index.md → /docs/
 * * /docs/index.mdx → /docs/
 * * Leaves external links untouched
 *
 * Remove also the public
 * * ../../../public/static/file.pdf -> /static/file.pdf
 *
 * @param publicDirName - the dir name
 * @param target - the external link target
 * @param base - the site base
 * @returns {(function(*): void)|*}
 */
export default function rehypeHrefRewrite({publicDirName = 'public', base = ''}: {
    publicDirName: string,
    base: string
}) {
    return function transformer(tree: Root) {
        visit(tree, "element", node => {

            if (isHastImgElement(node)) {

                if (node.properties?.src == null) {
                    return;
                }
                if (!base) {
                    return;
                }
                // with an image the full path should be given
                // the base head HTML element has no effect
                if (node.properties.src.startsWith("http")) {
                    return;
                }
                if (node.properties.src.endsWith(base)) {
                    return
                }
                node.properties.src = `${base}${node.properties.src}`
                return;
            }

            if (isHastAnchorElement(node)) {
                const href = node.properties.href;
                if (href == null) {
                    return;
                }

                // skip http, https, mailto link and other url with a scheme
                const hasScheme = /^\w+:\/\//.test(href);
                if (hasScheme) {
                    return;
                }

                // Skip local hash link
                if (href.startsWith("#")) {
                    return;
                }

                /**
                 * Special case so that the href is not empty
                 * by the replacement below
                 */
                if (href === "index.md" || href === "index.mdx") {
                    node.properties.href = ".";
                    return
                }

                // Remove .md or .mdx at the end (before optional slash)
                node.properties.href = removeMarkdownExtensionAndIndex(href)

                // Remove the public part
                node.properties.href = removePublicPart({
                    relativePath: node.properties.href,
                    publicDirName: publicDirName,
                    absolute: false,
                })
            }
        });
    };
}
