// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:layouts' {

    import type {ComponentType} from "react";
    import type {LayoutProps} from "@combostrap/interact/types";

    export function getLayoutComponent(name: string): ComponentType<LayoutProps> | undefined

}