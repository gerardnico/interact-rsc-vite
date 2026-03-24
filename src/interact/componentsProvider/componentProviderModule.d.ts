// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:components' {
    import type {ComponentType} from "react";
    import type {CodeProps} from "@combostrap/interact/components/Code";
    import type {HtmlProps} from "@combostrap/interact/components/Html";
    import type {HeadProps} from "@combostrap/interact/components/Head";
    import type {BodyProps} from "@combostrap/interact/components/Body";
    import type {NavBarProps} from "@combostrap/interact/components/NavBar";
    import type {TemplateProps} from "@combostrap/interact/types";
    import type {Page} from "@combostrap/interact/types";
    import type {MDXComponents} from "mdx/types.js";

    export function getLayoutComponent(name: string): ComponentType<TemplateProps> | undefined

    export function useMDXComponents(): MDXComponents

    export const Code: React.FunctionComponent<CodeProps>
    export const Html: React.FunctionComponent<HtmlProps>
    export const Head: React.FunctionComponent<HeadProps>
    export const Body: React.FunctionComponent<BodyProps>
    export const NavBar: React.FunctionComponent<NavBarProps>

    // Special component
    export const NotFound: Page

}