import type {Page} from "../pages/interactPage.js";


export type pagesMiddlewareType = (request: Request) => Promise<Page | undefined>;
export type pagesMiddlewareConstructorType = (props?: Record<string, unknown>) => Promise<pagesMiddlewareType>;

