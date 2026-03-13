import type {pagesMiddlewareType} from "./pagesProvider.js";
import type {Page} from "../pages/interactPage.js";

type cmsPipelineType = {
    use: (middleWareHandler: pagesMiddlewareType) => cmsPipelineType
    run: (ctx: Request) => Promise<Page | undefined>
}

export default function createPagesProviderPipeline(): cmsPipelineType {
    const pagesProviderMiddlewares: pagesMiddlewareType[] = [];

    function use(this: cmsPipelineType, middleWareHandler: pagesMiddlewareType): cmsPipelineType {
        pagesProviderMiddlewares.push(middleWareHandler);
        return this; // chainable
    }

    async function run(request: Request) {

        for (const pagesProviderMiddleware of pagesProviderMiddlewares) {
            const result = await pagesProviderMiddleware(request);
            if (result != null) {
                return result;
            }
        }

    }

    return {use, run};
}