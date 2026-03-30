/**
 * The processor
 * We don't have a full processor factory pattern
 * in one file because the useMdxComponents is dynamic
 * given by vite called interact:components
 * Because the markdown config is used in vite, we must
 * create the module in 2 steps
 */
import {useMDXComponents} from "interact:components";
import {unified} from "unified";
import remarkParse from "remark-parse";
import type {Root as MdastRoot} from "mdast";
import type {MdxJsxFlowElement, MdxJsxTextElement} from 'mdast-util-mdx-jsx'
import {mdxJsxFromMarkdown} from 'mdast-util-mdx-jsx'
import YAML from "yaml";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import {type ComponentType, Fragment, type ReactNode} from "react";
import {type Compatible, VFile, type VFile as VFileType} from "vfile";
import {mdxJsx} from 'micromark-extension-mdx-jsx'
import {mdxMd} from 'micromark-extension-mdx-md'
import type {Element as HastElement} from "hast";
import type {Page, TocNode} from "@combostrap/interact/types";
import {VFileMessage} from 'vfile-message'
import {compileSync, runSync} from '@mdx-js/mdx'
import * as jsxRuntime from 'react/jsx-runtime'
import {getMarkdownConfig} from "../../interact/markdown/conf/markdownConfig";
import type {markdownFormat} from "../../interact/config/configSchema";
import {statSync} from "node:fs";
import type {Frontmatter} from "../../interact/pages/interactPage";


// Markdown processing to react component via rehypeReact
// Why?
// because Mdx use rehypeRecma as compiler (ie the hast goes to the JavaScript Tree)
function markdownReactProcessing(vFileCompatible: Compatible) {

    let strictYamlParsing = false
    if (process.env['NODE_ENV'] !== "production") {
        strictYamlParsing = true
    }
    let components = useMDXComponents()
    let frontmatter: Frontmatter = {}

    // Delete comments
    // Not supported by MDX even if we choose only JSX (micromark-extension-mdx-jsx)
    if (typeof vFileCompatible === "string") {
        vFileCompatible = vFileCompatible.replace(/<!--[\s\S]*?-->/g, '')
    } else {
        if ('value' in vFileCompatible) {
            vFileCompatible.value = (vFileCompatible.value as string).replace(/<!--[\s\S]*?-->/g, '')
        }
    }

    let vFile: VFileType
    // noinspection JSUnusedGlobalSymbols - some property such as jsxs or createEvaluater are needed
    vFile = unified()
        .use(remarkParse)  // Parse markdown into mdast
        .use(function () {
            /**
             * We set configuration for the remark parse
             * https://github.com/remarkjs/remark/blob/6c18384e9731146a3e8dffe79d1d8e59316c6bf7/packages/remark-parse/lib/index.js#L37
             */
            const data = this.data()
            data.micromarkExtensions = data.micromarkExtensions || []
            data.fromMarkdownExtensions = data.fromMarkdownExtensions || []

            // Micromark extensions to change how Markdown is parsed
            // When working with mdast-util-from-markdown, you must combine this package with micromark-extension-mdx-jsx.
            // https://github.com/micromark/micromark-extension-mdx-jsx
            // List: https://github.com/syntax-tree/mdast-util-from-markdown#list-of-extensions
            data.micromarkExtensions.push(mdxJsx())

            // Disallow
            // [
            //   "autolink",
            //   "codeIndented",
            //   "htmlFlow",
            //   "htmlText"
            // ]
            data.micromarkExtensions.push(mdxMd())

            // extensions to change how tokens are turned into a tree
            // https://github.com/syntax-tree/mdast-util-mdx-jsx
            data.fromMarkdownExtensions.push(mdxJsxFromMarkdown())

        })
        .use(getMarkdownConfig().getMdConfig().remarkPlugins || [])
        .use(function () {
            /**
             * Capture Frontmatter
             * The order is important because the Yaml node disappears
             * at the end of the pipeline
             */
            return function (tree: MdastRoot) {
                for (const node of tree.children) {
                    if (node?.type == 'yaml') {
                        frontmatter = YAML.parse(node.value, {strict: strictYamlParsing});
                    }
                }
            }
        })
        .use(remarkRehype, {        // mdast → hast
            allowDangerousHtml: true,
            // We pass the element as seen here
            // https://github.com/syntax-tree/mdast-util-mdx-jsx#html
            passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement'],
            // https://github.com/syntax-tree/mdast-util-to-hast#handler
            // Transform Mdast element into Hast element
            // We transform the mdxElement
            handlers: {
                /**
                 *
                 * @param state https://github.com/syntax-tree/mdast-util-to-hast#state
                 * @param node tttps://github.com/syntax-tree/mdast#nodes
                 * @param _parent https://github.com/syntax-tree/mdast#parent
                 */
                mdxJsxFlowElement(state: any, node: MdxJsxFlowElement, _parent: any): HastElement {
                    let properties: Record<string, any> = {};
                    for (const attribute of node.attributes) {
                        let value = attribute.value;
                        if (!('name' in attribute)) {
                            // MdxJsxExpressionAttribute do not have name attribute
                            continue
                        }
                        if (value === null) {
                            value = "true";
                        }
                        properties[attribute.name] = value;
                    }
                    return {
                        type: 'element',
                        tagName: node.name || 'unknown',
                        properties: properties,
                        children: state.all(node)
                    }
                },
                mdxJsxTextElement(state: any, node: MdxJsxTextElement): HastElement {
                    let properties: Record<string, any> = {};
                    for (const attribute of node.attributes) {
                        let value = attribute.value;
                        if (!('name' in attribute)) {
                            // MdxJsxExpressionAttribute do not have name attribute
                            continue
                        }
                        if (value === null) {
                            value = 'true';
                        }
                        properties[attribute.name] = value;
                    }
                    return {
                        type: 'element',
                        tagName: node.name || 'unknown',
                        properties: properties,
                        children: state.all(node)
                    }
                }
            }
        })
        // rehypeRaw - not needed all HTML element are already mdxJsxElement
        // !!! and it turns custom element name in lowercase !!!
        //.use(rehypeRaw)
        .use(getMarkdownConfig().getMdConfig().rehypePlugins || [])
        .use(rehypeReact, {         // hast → React element tree
            ...jsxRuntime,
            Fragment: Fragment,
            components: components,
        })
        .processSync(vFileCompatible);

    if (vFile?.path != null) {
        const stat = statSync(vFile?.path);
        frontmatter.lastModified = stat.mtime.toISOString()
    }

    return {
        frontmatter: frontmatter,
        toc: vFile.data?.toc as TocNode[] || [],
        default: () => {
            return vFile.result as ReactNode
        }
    }
}


/**
 * ie on demand processing
 * https://mdxjs.com/guides/mdx-on-demand/
 * @param vFileCompatible
 * @param options
 * @param options.format
 */
function mdxProcessing(vFileCompatible: Readonly<Compatible>, {format = 'mdx'}: {
    format?: 'mdx' | 'md'
}): Page {
    // Source: https://mdxjs.com/packages/mdx/#example
    const code = String(compileSync(vFileCompatible, {
        outputFormat: 'function-body',
        remarkPlugins: getMarkdownConfig().getMdxConfig().remarkPlugins,
        rehypePlugins: getMarkdownConfig().getMdxConfig().rehypePlugins,
        format: format,
        // providerImportSource: '@mdx-js/react', // mandatory to use useMDXComponents below
        // @mdx-js/mdx expects a providerImportSource to have been set at compile time in order for useMDXComponents to be used at runtime.
        // If you compiled the MDX without providerImportSource: '@mdx-js/react' (or equivalent), the generated code never calls useMDXComponents() at all — it simply doesn't know components can be injected that way. So the useMDXComponents option in run is silently ignored.
        providerImportSource: getMarkdownConfig().getProviderImportSource(), // mandatory to use useMDXComponents below
    }))
    // Create the {default: Content}
    return runSync(code, {
        ...jsxRuntime,
        useMDXComponents
    });
}


/**
 * From a markdown fragment to a React component
 */
// noinspection JSUnusedGlobalSymbols - exported in package.json
export function markdownToComponentSync(vFileCompatible: Compatible, options?: {
    format: markdownFormat
}):ComponentType {
    return markdownToPageSync(vFileCompatible, options).default as ComponentType;
}

// Sync because this is on the server
// See https://github.com/mdx-js/mdx/blob/af23c2d18b58467db567b7afe78d7492bb4ea4bc/packages/mdx/lib/core.js#L161
export function markdownToPageSync(vFileCompatible: Compatible, options?: {
    format: markdownFormat
}): Page {
    const format: markdownFormat = options?.format || getMarkdownConfig().getDefaultMarkdownFormat();
    try {
        if (format == 'mdx' || format == 'md') {
            return mdxProcessing(vFileCompatible, {format: format});
        }
        return markdownReactProcessing(vFileCompatible);
    } catch (e) {
        return {
            default: () => {
                return (
                    <>
                        <p>Error seen while parsing Markdown:</p>
                        <p>Message: {String(e)}</p>
                        {e instanceof VFileMessage && (
                            <>
                                {e.line && (<p>Starting line: {e.line}</p>)}
                                {e.column && (<p>Starting column: {e.column}</p>)}
                                {e.place != null && (<p>Point | Position: {JSON.stringify(e.place)}</p>)}
                                <p>Source: {e.source}</p>
                                <p>RuleId: {e.ruleId}</p>
                                {e.url && (<p>Url: <a href={e.url}>{e.ruleId}</a></p>)}
                            </>
                        )}
                        {typeof vFileCompatible === "string" && (
                            <>
                                <p>Content:</p>
                                <pre dangerouslySetInnerHTML={{__html: vFileCompatible}}></pre>
                            </>
                        )}
                        {(vFileCompatible instanceof VFile) && (
                            <>
                                <p>Path: {vFileCompatible.path}</p>
                                <p>Content:</p>
                                <pre dangerouslySetInnerHTML={{__html: vFileCompatible.value}}></pre>
                            </>
                        )}

                    </>
                )
            }
        }
    }
}





