
declare module "interact:pages-provider-manager" {
    import type pageMiddlewareHandlerType from "./pagesProvider.d.ts"
    export const pagesProviderHandlers : pageMiddlewareHandlerType[]
}