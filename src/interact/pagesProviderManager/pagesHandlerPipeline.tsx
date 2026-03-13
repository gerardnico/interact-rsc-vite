import type {PagesHandler} from "./pagesProvider.js";
import type {Page} from "../pages/interactPage.js";

type cmsPipelineType = {
    use: (middleWareHandler: PagesHandler) => cmsPipelineType
    run: (ctx: Request) => Promise<Page | undefined>
}

export default function createPagesProviderPipeline(): cmsPipelineType {
    const pagesProviderMiddlewares: PagesHandler[] = [];

    function use(this: cmsPipelineType, middleWareHandler: PagesHandler): cmsPipelineType {
        pagesProviderMiddlewares.push(middleWareHandler);
        return this; // chainable
    }

    async function run(request: Request) {

        for (const pagesProviderMiddleware of pagesProviderMiddlewares) {
            let result;
            try {
                result = await pagesProviderMiddleware(request);
            } catch (e) {
                // Error
                return {
                    default: () => {
                        return (
                            <>
                                <p>Error while running a pages Provider Middleware:</p>
                                <p>{String(e)}</p>
                            </>
                        )
                    }
                }
            }
            if (result != null) {
                return result;
            }
        }

    }

    return {use, run};
}