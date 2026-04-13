import type {Root} from "hast";

/**
 * If your Markdown input is a single line of text like Hello world, remark-parse will parse it
 * as a paragraph node, which becomes <p>Hello world</p> in hast.
 * That <p> is semantically correct, but you may not want it for inline Markdown
 * This plugin delete it
 */
export function rehypeUpdateRootTagName({rootTagName}: { rootTagName: string }) {
    if (rootTagName == null) {
        throw new Error('root tag name is required, did you init the plugin as an array passing the args in the second element');
    }
    return function transformer(tree: Root) {
        if (
            tree.type === 'root' &&
            tree.children != null &&
            tree.children.length === 1 &&
            tree.children[0]?.type === 'element'
        ) {
            tree.children[0].tagName = rootTagName
        }
    }
}