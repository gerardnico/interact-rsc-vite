import type {LayoutProps} from "@combostrap/interact/types";
import React from "react";
import  {
    OpenAsMarkdown,
    OpenInChatGPT,
    OpenInClaude,
    OpenInCursor,
    OpenInScira,
    OpenInT3,
    OpenInVo,
    OpenSplitButton
} from "@/components/interact/Open";


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
            <OpenSplitButton>
                <OpenAsMarkdown>Open as Markdown</OpenAsMarkdown>
                <OpenInClaude>Open in Claude</OpenInClaude>
                <OpenInChatGPT>Open in ChatGpt</OpenInChatGPT>
                <OpenInCursor>Open in Cursor</OpenInCursor>
                <OpenInScira>Open in Scira</OpenInScira>
                <OpenInT3>Open in T3</OpenInT3>
                <OpenInVo>Open in Vo</OpenInVo>
            </OpenSplitButton>

        </header>
    )
}