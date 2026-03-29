import type {ContextProps} from "../types/index.js";
import React from "react";

export type HeroProps = React.HTMLAttributes<HTMLElement> & ContextProps

/**
 * Called the hero and not header so that
 * it's less ambiguous (could also mean the site’s top navigation too)
 */
export default function Hero({page, request, ...htmlProps}: HeroProps) {

    let title = page?.frontmatter?.title;
    if (!title) {
        title = new URL(request.url).pathname.slice(1);
    }
    return (
        <header {...htmlProps}>
            {title &&
                <h1 className="h1 outline-heading-cs heading-cs heading-h1-cs">{title}</h1>
            }
        </header>
    )
}