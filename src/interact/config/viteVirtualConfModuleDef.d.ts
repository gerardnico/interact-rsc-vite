/**
 * Definition o the virtual module
 * Don't give the same file name as the vite plugin module otherwise it's
 * seen as the definition of the module file instead
 */
declare module 'interact:config' {
    import {type InteractConfig} from "@combostrap/interact/types";

    export const interactConfig: InteractConfig;
    // noinspection JSUnusedGlobalSymbols - no idea why but it's not seen as used
    export default interactConfig;
}