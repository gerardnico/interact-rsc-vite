// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:layouts' {

    import type {ComponentType} from "react";
    import type {ContextProps} from "@combostrap/interact/types";

    export function getLayoutComponent(name: string): ComponentType<ContextProps> | undefined

}