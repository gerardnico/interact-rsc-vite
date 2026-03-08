declare module 'interact:page-modules' {
    import PageModule from "./pageModule.js";

    export function getModulePage(opts: {
        path: string;
        notFoundPath?: string;
    }): PageModule | undefined;

    export const modulePages: Record<string, PageModule>;
    export default getModulePage;
}