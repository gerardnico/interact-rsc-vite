import {visit, SKIP} from 'unist-util-visit';
import type {Root} from "hast";


/**
 * Unified rehype plugin that removes elements with the class "print:hidden"
 */
export default function rehypeRemoveNoPrint() {
    return (tree: Root) => {
        visit(tree, 'element', (node, index, parent) => {
            if (!parent || index == null) return;

            const classes = node.properties?.["className"];
            const hasNoPrint = Array.isArray(classes)
                ? classes.includes('print:hidden')
                : typeof classes === 'string' && classes.split(' ').includes('print:hidden');

            if (hasNoPrint) {
                parent.children.splice(index, 1);
                return [SKIP, index]; // don't descend, and re-check current index
            }
        });
    };
}