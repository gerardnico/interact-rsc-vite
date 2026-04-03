import type {
    MiddlewareResult,
    Middleware
} from "../../../interact/middlewareEngine/interactMiddleware";
import type {ContextProps} from "../../../interact/componentsProvider/contextProps";
import type {Page} from "../../../interact/pages/interactPage";

type middlewarePipelineType = {
    use: (middleWare: Middleware) => middlewarePipelineType
    run: (ctx: ContextProps) => Promise<Response | Page | undefined | null>
}

export default function createMiddlewarePipeline(): middlewarePipelineType {
    const middlewares: Middleware[] = [];

    function use(this: middlewarePipelineType, middleWare: Middleware): middlewarePipelineType {
        middlewares.push(middleWare);
        return this; // chainable
    }

    async function resolveResponse(response: MiddlewareResult): Promise<Response | Page | null | undefined> {
        return typeof response === "function" ? await (response)() : response;
    }

    async function run(context: ContextProps) {

        for (const middleware of middlewares) {
            let result;
            try {
                result = await middleware.handler(context);
            } catch (e) {
                context.response.status = 500;
                // Error
                return {
                    default:
                        () => {
                            return (
                                <>
                                    <p>Error while running the Middleware {middleware.name}:</p>
                                    <p>{String(e)}</p>
                                </>
                            )
                        }
                }
            }
            let response = await resolveResponse(result);
            if (response != null) {
                if (!(response instanceof Response)) {
                    if (!("default" in response)) {
                        context.response.status = 500;
                        return {
                            default: () => {
                                return (
                                    <p>Error the middleware handler {middleware.name} has not returned a valid page
                                        response. The default
                                        property is missing</p>
                                )
                            }
                        }
                    }
                }
                return response;
            }
        }

    }

    return {use, run};
}