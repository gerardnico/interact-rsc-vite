import fs from 'fs';
import path from 'path';
import {visit} from 'unist-util-visit';
import type {Root} from "mdast";
import {VFile} from "vfile";
import {is} from 'unist-util-is'
import {removePublicPart} from "../util/unified-util.js";

const MD_EXT_RE = /\.(md|mdx)$/i;

/**
 * Check https://github.com/syntax-tree/mdast#link
 */
export default function remarkLocalLinkChecker({
                                                   pagesDir = 'pages',
                                               }: {
    pagesDir: string,
}) {
    if (process.env['NODE_ENV'] === "production") {
        return;
    }
    const strict = true
    return function (tree: Root, vFile: VFile) {

        if (vFile.path == undefined) {
            // case of content processing without path
            return;
        }
        const currentFileDir = path.dirname(vFile.path);
        const pagesRoot = path.resolve(process.cwd(), pagesDir);

        visit(tree, (node) => {

            if (is(node, 'image')) {

                node.url = removePublicPart({relativePath: node.url, absolute: true})
                return;
            }

            if (!is(node, 'link')) {
                return;
            }
            const url = node.url;

            // Ignore external / special links
            if (
                url.startsWith('http://') ||
                url.startsWith('https://') ||
                url.startsWith('#') ||
                url.startsWith('mailto:')
            ) {
                return;
            }

            if (!MD_EXT_RE.test(url)) return;

            let resolvedPath;
            // Absolute Markdown link → src/pages
            if (url.startsWith('/')) {
                resolvedPath = path.join(pagesRoot, url);
            }
            // Relative Markdown link → vfile
            else {
                resolvedPath = path.resolve(currentFileDir, url);
            }

            if (!fs.existsSync(resolvedPath)) {
                /**
                 * vfile.message() → nice source location in logs
                 */
                const message = vFile.message(
                    `Linked markdown file does not exist: ${url}`,
                    node,
                    'remark-local-link-checker'
                );

                /**
                 * Does not stop the build
                 */
                message.fatal = strict;
                message.actual = resolvedPath;

                if (strict) {
                    throw new Error(
                        `Missing markdown link: ${url}\n` +
                        `Resolved to: ${resolvedPath}\n` +
                        `File: ${vFile.path}`
                    );
                }
            }
        });
    };
}
