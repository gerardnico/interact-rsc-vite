import type {LayoutProps} from "@combostrap/interact/types";
import React from "react";

export type HeroProps = React.HTMLAttributes<HTMLElement> & LayoutProps

/**
 * Called the hero and not header so that
 * it's less ambiguous (could also mean the site’s top navigation too)
 */
export default function Hero({page, context, ...htmlProps}: HeroProps) {

    let title = page?.frontmatter?.title;
    if (!title) {
        title = context.url.pathname.slice(1);
    }
    return (
        <header {...htmlProps}>
            {title &&
                <h1 className="h1 outline-heading-cs heading-cs heading-h1-cs">{title}</h1>
            }
        </header>
    )
}