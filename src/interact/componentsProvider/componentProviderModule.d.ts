// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:components' {

    import type {CodeProps} from "@combostrap/interact/components/Code";
    import type {TocProps} from "@combostrap/interact/components/Toc";
    import type {AsideProps} from "@combostrap/interact/components/Aside";
    import type {HeroProps} from "@combostrap/interact/components/Hero";
    import type {HtmlProps} from "@combostrap/interact/components/Html";
    import type {HeadProps} from "@combostrap/interact/components/Head";
    import type {BodyProps} from "@combostrap/interact/components/Body";
    import type {NavBarProps} from "@combostrap/interact/components/NavBar";
    import type {Page} from "@combostrap/interact/types";
    import type {MDXComponents} from "mdx/types.js";

    export function useMDXComponents(): MDXComponents

    export const Code: React.FunctionComponent<CodeProps>
    export const Html: React.FunctionComponent<HtmlProps>
    export const Head: React.FunctionComponent<HeadProps>
    export const Body: React.FunctionComponent<BodyProps>
    export const NavBar: React.FunctionComponent<NavBarProps>
    export const Toc: React.FunctionComponent<TocProps>
    export const Hero: React.FunctionComponent<HeroProps>
    export const Aside: React.FunctionComponent<AsideProps>

    // Special component
    export const NotFound: Page

}