import type {Frontmatter, LayoutProps, Page} from "@combostrap/interact/types";
import React from "react";
import {getInteractConfig} from "../../../node/config/interactConfig.ts";
import {getPagesTree} from "../../rsc/server/handler.tsx";
import AsideResponsive from "@/components/interact/AsideResponsive.tsx";
import {SearchBox} from "@/components/interact/SearchBox.tsx";
import Tree from "@/components/interact/Tree.tsx";

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
        path: toRoute(path),
        name: mod.frontmatter?.title ?? "Untitled",
        order: mod.frontmatter?.order ?? 0,
        group: mod.frontmatter?.group
    }))
    .sort((a, b) => a.order - b.order)

export type AsideProps = React.HTMLAttributes<HTMLElement> & LayoutProps


export default function Aside({page, context, ...props}: AsideProps) {
    const interactConfig = getInteractConfig();
    const data = getPagesTree(interactConfig.paths.pagesDirectory).children ?? []

    return (
        <AsideResponsive {...props}>
            <SearchBox/>
            <Tree data={data}/>
        </AsideResponsive>
    )


}