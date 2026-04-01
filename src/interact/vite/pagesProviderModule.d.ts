declare module 'interact:page-modules' {
    import {Page} from "@combostrap/interact/types";

    export function getModulePage(opts: {
        path: string;
        notFoundPath?: string;
    }): Page | undefined;

    export const modulePages: Record<string, Page>;
    export default getModulePage;
}