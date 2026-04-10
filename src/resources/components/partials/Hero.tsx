import type {LayoutProps} from "@combostrap/interact/types";
import React from "react";
import {
    CopyAsMarkdownButton,
    OpenAsMarkdownAnchor,
    OpenInChatGPTAnchor,
    OpenInClaudeAnchor,
    OpenInCursorAnchor,
    OpenInSciraAnchor,
    OpenInT3Anchor,
    OpenInVoAnchor,
    PageMenuButton
} from "@/components/interact/PageMenuButton";


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
            <PageMenuButton>
                <CopyAsMarkdownButton>Copy As Markdown</CopyAsMarkdownButton>
                <OpenAsMarkdownAnchor>Open as Markdown</OpenAsMarkdownAnchor>
                <OpenInClaudeAnchor>Open in Claude</OpenInClaudeAnchor>
                <OpenInChatGPTAnchor>Open in ChatGpt</OpenInChatGPTAnchor>
                <OpenInCursorAnchor>Open in Cursor</OpenInCursorAnchor>
                <OpenInSciraAnchor>Open in Scira</OpenInSciraAnchor>
                <OpenInT3Anchor>Open in T3</OpenInT3Anchor>
                <OpenInVoAnchor>Open in Vo</OpenInVoAnchor>
            </PageMenuButton>

        </header>
    )
}