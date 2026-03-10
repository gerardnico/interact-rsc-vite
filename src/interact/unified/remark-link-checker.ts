import fs from 'fs';
import path from 'path';
import {visit} from 'unist-util-visit';
import type {Root} from "mdast";
import {VFile} from "vfile";
import {is} from 'unist-util-is'
import {removePublicPart} from "./unified-util.js";

const MD_EXT_RE = /\.(md|mdx)$/i;

/**
 * Check https://github.com/syntax-tree/mdast#link
 * @param pagesDir
 * @param severity
 * @returns {(function(*, *): void)|*}
 */
export default function remarkLinkChecker({
                                              pagesDir = 'src/pages',
                                              strict = false, // 'warning' | 'error'
                                          } = {}) {
    return function (tree: Root, vFile: VFile) {

        const currentFileDir = path.dirname(vFile.path);
        const pagesRoot = path.resolve(process.cwd(), pagesDir);

        visit(tree, (node) => {

            if (is(node, 'image')) {
                /**
                 * Why absolute true?
                 * For the astro img in Markdown, the path should not be relative
                 * Otherwise we get: Cannot find module 'astro-and-vite-build.png' imported from markdownPathPage
                 */
                node.url = removePublicPart({relativePath: node.url, absolute: true})
                return;
            }

            if (!is(node, 'link')) {
                return;
            }
            const url = node.url;
            if (typeof url !== 'string') return;

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
                    'remark-check-md-links'
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
