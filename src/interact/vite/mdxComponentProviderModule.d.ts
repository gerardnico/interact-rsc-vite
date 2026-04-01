// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:mdx-components' {

    import type {Page} from "@combostrap/interact/types";
    import type {MDXComponents} from "mdx/types.js";

    export function useMDXComponents(): MDXComponents


    // Special component
    export const NotFound: Page

}