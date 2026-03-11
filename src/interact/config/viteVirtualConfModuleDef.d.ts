/**
 * Don't give the same name as the vite plugin module otherwise it does work
 * as it becomes the definition of the module instead
 */
declare module 'interact:config' {
    import {type InteractConfigType} from "./configHandler.js";

    export const interactConfig: InteractConfigType;
    // no idea why but it's not seen
    // noinspection JSUnusedGlobalSymbols
    export default interactConfig;
}