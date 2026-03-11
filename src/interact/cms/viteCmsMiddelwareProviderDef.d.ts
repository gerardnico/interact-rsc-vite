
declare module "interact:cms-provider" {
    import type CmsMiddlewareHandlerType from "./cmsMiddleware.d.ts"
    export const cmsHandlers : CmsMiddlewareHandlerType[]
}