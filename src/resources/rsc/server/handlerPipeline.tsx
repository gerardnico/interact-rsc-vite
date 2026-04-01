import type {MiddlewareResult, MiddlewarePageResponse, Middleware} from "../../../interact/middlewareEngine/interactMiddleware";

type middlewarePipelineType = {
    use: (middleWare: Middleware) => middlewarePipelineType
    run: (ctx: Request) => Promise<MiddlewarePageResponse | Response | undefined | null>
}

export default function createMiddlewarePipeline(): middlewarePipelineType {
    const middlewares: Middleware[] = [];

    function use(this: middlewarePipelineType, middleWare: Middleware): middlewarePipelineType {
        middlewares.push(middleWare);
        return this; // chainable
    }

    async function resolveResponse(response: MiddlewareResult): Promise<Response | MiddlewarePageResponse | null | undefined> {
        return typeof response === "function" ? await (response)() : response;
    }

    async function run(request: Request) {

        for (const middleware of middlewares) {
            let result;
            try {
                result = await middleware.handler(request);
            } catch (e) {
                // Error
                return {
                    status: 500,
                    page: {
                        default: () => {
                            return (
                                <>
                                    <p>Error while running the Middleware {middleware.name}:</p>
                                    <p>{String(e)}</p>
                                </>
                            )
                        }
                    }
                } satisfies MiddlewarePageResponse
            }
            let response = await resolveResponse(result);
            if (response != null) {
                if (!(response instanceof Response)) {
                    if (!("page" in response)) {
                        return {
                            status: 500,
                            page: {
                                default: () => {
                                    return (
                                        <p>Error the middleware handler {middleware.name} has not returned a valid page response. The page
                                            property is missing</p>
                                    )
                                }
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