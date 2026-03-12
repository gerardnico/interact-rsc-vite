
declare module 'interact:components' {
    import type {MDXComponents} from "mdx/types.js";
    import type {ComponentType} from "react";
    import type {CodeProps} from "#components/Code";
    import type {TemplateProps} from "./templateComponent.js";
    import type {PageModule} from "../pages/pageModule.js";

    export function getLayoutComponent(name: string): ComponentType<TemplateProps> | undefined
    export function useMDXComponents(): MDXComponents
    export const Code: ComponentType<CodeProps>
    export const NotFound: PageModule

}