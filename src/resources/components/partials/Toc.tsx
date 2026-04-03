import type {LayoutProps, TocNode} from "@combostrap/interact/types";
import "./toc.css"
import {getInteractConfig} from "@combostrap/interact/config";
import React from "react";
import clsx from "clsx";


export type TocProps = React.HTMLAttributes<HTMLElement> & LayoutProps & {
    maxDepth?: number;
}

function TocItems({entries, maxDepth, currentDepth = 1}: {
    entries: TocNode[],
    maxDepth: number,
    currentDepth?: number
}) {
    if (currentDepth > maxDepth) return null;

    return (
        <ul>
            {entries.map((heading, i) => (
                <li key={i} className={`toc-entry toc-level-${heading.depth}`}>
                    <a href={`#${heading.id}`}>
                        {heading.value}
                    </a>
                    {heading.children && heading.children.length > 0 && (
                        <TocItems entries={heading.children} maxDepth={maxDepth} currentDepth={currentDepth + 1}/>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default function Toc({maxDepth, page, context, className, ...navProps}: TocProps) {
    if (maxDepth == null) {
        maxDepth = getInteractConfig().components.Toc?.props?.maxDepth;
        if (maxDepth == null) {
            maxDepth = 3
        }
    }
    const toc: TocNode[] | undefined = page?.toc;
    /**
     * The selector is a class so that we can put more than one
     * for documentation purposes
     */
    return (
        <nav className={clsx("toc", className)} {...navProps}>
            <p className="toc-header">Table of Contents</p>
            {toc && <TocItems entries={toc} maxDepth={maxDepth}/>}
        </nav>
    );
}