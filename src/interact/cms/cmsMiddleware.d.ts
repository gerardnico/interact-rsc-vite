import type {PageModule} from "../pages/pageModule.js";


export type CmsMiddlewareHandlerType = (request: Request) => Promise<PageModule | undefined>;
export type CmsMiddlewareConstructorType = (props?: Record<string, unknown>) => Promise<CmsMiddlewareHandlerType>;

