import type {CmsMiddlewareHandlerType} from "./cmsMiddleware.js";
import type {PageModule} from "../pages/pageModule.js";

type cmsPipelineType = {
    use: (middleWareHandler: CmsMiddlewareHandlerType) => cmsPipelineType
    run: (ctx: Request) => Promise<PageModule | undefined>
}

export default function createCmsPipeline(): cmsPipelineType {
    const middlewares: CmsMiddlewareHandlerType[] = [];

    function use(middleWareHandler: CmsMiddlewareHandlerType): cmsPipelineType {
        middlewares.push(middleWareHandler);
        // @ts-ignore -???
        return this; // chainable
    }

    async function run(ctx: Request) {

        for (const middlewareX of middlewares) {
            const result = await middlewareX(ctx);
            if (result != null) {
                return result;
            }
        }

    }

    return {use, run};
}