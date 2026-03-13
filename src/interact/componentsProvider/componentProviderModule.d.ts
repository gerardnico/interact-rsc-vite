
declare module 'interact:components' {
    import type {MDXComponents} from "mdx/types.js";
    import type {ComponentType} from "react";
    import type {CodeProps} from "#components/Code";
    import type {TemplateProps} from "@combostrap/interact/types";
    import type {Page} from "@combostrap/interact/types";

    export function getLayoutComponent(name: string): ComponentType<TemplateProps> | undefined
    export function useMDXComponents(): MDXComponents
    export const Code: ComponentType<CodeProps>
    export const NotFound: Page

}