import {unified} from "unified";
import remarkParse from "remark-parse";
import type {Root} from "mdast";
import YAML from "yaml";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import {type Component, createElement, Fragment} from "react";
import {jsx, jsxs} from "react/jsx-runtime";
import {getMandatoryUnifiedPlugins} from "../conf/markdownBasePlugins.js";
import {markdownConfig} from "@interact/markdown-config";
import interactConfig from "interact:config";
import type {VFile} from "vfile";

const interactMd = {
    process: async (content: string | VFile) => {

        const mandatoryUnifiedPlugins = getMandatoryUnifiedPlugins(interactConfig)

        let strictYamlParsing = false
        if (process.env['NODE_ENV'] !== "production") {
            strictYamlParsing = true
        }
        let components: Component[] = []
        // We installed rehypeReact because Mdx use rehypeRecma as compiler (ie the hast goes to the JavaScript Tree)
        // https://github.com/mdx-js/mdx/blob/af23c2d18b58467db567b7afe78d7492bb4ea4bc/packages/mdx/lib/core.js#L161
        let frontmatter = {}
        const vFile = await unified()
            .use(remarkParse)  // Parse markdown into mdast
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
                // only
                //passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement']
            })
            .use(mandatoryUnifiedPlugins.markdown.rehypePlugins || [])
            .use(markdownConfig.rehypePlugins || [])
            .use(rehypeReact, {         // hast → React element tree
                createElement,
                Fragment,
                jsx,
                jsxs,
                components: components
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