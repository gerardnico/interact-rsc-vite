// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:layouts' {

    import type {ComponentType} from "react";
    import type {TemplateProps} from "@combostrap/interact/types";

    export function getLayoutComponent(name: string): ComponentType<TemplateProps> | undefined

}