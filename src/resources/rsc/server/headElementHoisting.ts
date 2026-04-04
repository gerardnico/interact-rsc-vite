import React, {type ReactElement, type ReactNode} from "react";
import type {PageElements} from "../../../interact/pages/interactPage";


function isReactElement(node: ReactNode): node is ReactElement {
    return React.isValidElement(node);
}

function shouldHoist(element: ReactElement): boolean {
    return element.type === "meta" || element.type === "script" || element.type === "style" || element.type === "link";
}

/**
 * Traverses a React element tree, extracts all <meta> and <script> elements,
 * and returns a cleaned tree alongside the hoisted elements.
 */
export function hoistHeadElements(node: ReactNode): PageElements {
    const hoisted: ReactElement[] = [];

    function traverse(node: ReactNode): ReactNode {
        // Primitives and null — nothing to do
        if (!isReactElement(node)) {
            if (Array.isArray(node)) {
                return node.map((child) => traverse(child));
            }
            return node;
        }

        // This element itself should be hoisted
        if (shouldHoist(node)) {
            // Ensure a stable key for deduplication
            const key = node.key ?? `hoisted-${hoisted.length}`;
            hoisted.push(React.cloneElement(node, {key}));
            return null; // Remove from tree
        }

        // Recurse into children
        const {children} = node.props as { children?: ReactNode };
        if (children == null) {
            return node; // Leaf — no children to inspect
        }

        const newChildren = Array.isArray(children)
            ? children.map((child) => traverse(child))
            : traverse(children);

        // Avoid cloning if children didn't change
        const childrenChanged = Array.isArray(children)
            ? children.some((c, i) => c !== (newChildren as ReactNode[])[i])
            : children !== newChildren;

        return childrenChanged
            ? React.cloneElement(node, undefined, newChildren)
            : node;
    }

    const cleanTree = traverse(node);
    return {contentElement: cleanTree, headElements: hoisted};
}