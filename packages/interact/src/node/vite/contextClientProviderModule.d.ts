// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:client-contexts' {

    import type {ComponentType} from "react";

    export function getContextComponents(): Record<string,ComponentType<{ children: ReactNode }>>

}