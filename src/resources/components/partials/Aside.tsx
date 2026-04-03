import type {Frontmatter, Page, LayoutProps} from "@combostrap/interact/types";
import React from "react";

const pages = import.meta.glob<Page<Frontmatter>>(
    "./pages/**/*.ts",
    {eager: true}
)

function toRoute(path: string) {
    return path
        .replace("./pages", "")
        .replace(/index\.ts$/, "")
        .replace(/\.ts$/, "")
}

export const nav = Object.entries(pages)
    .map(([path, mod]) => ({
        route: toRoute(path),
        title: mod.frontmatter?.title ?? "Untitled",
        order: mod.frontmatter?.order ?? 0,
        group: mod.frontmatter?.group
    }))
    .sort((a, b) => a.order - b.order)

export type AsideProps = React.HTMLAttributes<HTMLElement> & LayoutProps

// @ts-ignore -- exported
export default function Aside({page, context, ...props}: AsideProps) {
    return (
        <div {...props}></div>
    )
}