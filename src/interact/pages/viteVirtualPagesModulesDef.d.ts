declare module 'interact:page-modules' {
    import {InteractPage} from "@combostrap/interact/types";

    export function getModulePage(opts: {
        path: string;
        notFoundPath?: string;
    }): InteractPage | undefined;

    export const modulePages: Record<string, InteractPage>;
    export default getModulePage;
}