import {unified} from "unified";
import remarkParse from "remark-parse";
import type {Root} from "mdast";
import type {MdxJsxFlowElement, MdxJsxTextElement} from 'mdast-util-mdx-jsx'
import YAML from "yaml";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import {createElement, Fragment} from "react";
import {jsx, jsxs} from "react/jsx-runtime";
import {getMandatoryUnifiedPlugins} from "../conf/markdownBasePlugins.js";
import {markdownConfig} from "@interact/markdown-config";
import interactConfig from "interact:config";
import type {VFile} from "vfile";
import {useMDXComponents} from "interact:components";
import {mdxJsx} from 'micromark-extension-mdx-jsx'
import {mdxJsxFromMarkdown} from 'mdast-util-mdx-jsx'
import * as acorn from "acorn";
import type {Element as HastElement} from "hast";

// Markdown processing to react component via rehypeReact
// Why?
// because Mdx use rehypeRecma as compiler (ie the hast goes to the JavaScript Tree)
// See https://github.com/mdx-js/mdx/blob/af23c2d18b58467db567b7afe78d7492bb4ea4bc/packages/mdx/lib/core.js#L161
const interactMd = {
    process: async (content: string | VFile) => {

        const mandatoryUnifiedPlugins = getMandatoryUnifiedPlugins(interactConfig)

        let strictYamlParsing = false
        if (process.env['NODE_ENV'] !== "production") {
            strictYamlParsing = true
        }
        let components = useMDXComponents()

        let frontmatter = {}

        // noinspection JSUnusedGlobalSymbols - some property such as jsxs or createEvaluater are needed
        const vFile = await unified()
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
                data.micromarkExtensions.push(mdxJsx({acorn: acorn, addResult: true}))

                // extensions to change how tokens are turned into a tree
                // https://github.com/syntax-tree/mdast-util-mdx-jsx
                data.fromMarkdownExtensions.push(mdxJsxFromMarkdown())

            })
            .use(mandatoryUnifiedPlugins.markdown.remarkPlugins || [])
            .use(markdownConfig.remarkPlugins || [])
            .use(function () {
                /**
                 * Capture Frontmatter
                 * The order is important because the Yaml node disappears
                 * at the end of the pipeline
                 */
                return function (tree: Root) {
                    for (const node of tree.children) {
                        if (node?.type == 'yaml') {
                            frontmatter = YAML.parse(node.value, {strict: strictYamlParsing});
                        }
                    }
                }
            })
            .use(remarkRehype, {        // mdast → hast
                allowDangerousHtml: false,
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
            .use(mandatoryUnifiedPlugins.markdown.rehypePlugins || [])
            .use(markdownConfig.rehypePlugins || [])
            .use(rehypeReact, {         // hast → React element tree
                jsx,
                jsxs,
                createElement,
                Fragment,
                components: components,
                // to resolve: Cannot handle MDX estrees without `createEvaluater`
                // https://github.com/syntax-tree/hast-util-to-jsx-runtime#createevaluater
                createEvaluater() {
                    return {
                        evaluateExpression(expression: any) {
                            // return undefined or implement actual eval
                            console.log(expression);
                            return undefined
                        },
                        evaluateProgram(program: any) {
                            console.log(program);
                            return undefined
                        },
                    }
                },
            }).process(content);
        return {
            frontmatter: frontmatter,
            toc: vFile.data?.toc || {},
            default: () => {
                return vFile.result
            }
        }
    }
}
export default interactMd