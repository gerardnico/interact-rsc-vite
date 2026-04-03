import type {Page} from "../pages/interactPage.js";
import type {ReactNode} from "react";
import type {ContextProps} from "../componentsProvider/contextProps.js";





type MiddlewareResponseValue =
    | Response
    | (() => Response)
    | (() => Promise<Response>)
    | Page
    | (() => Page)
    | (() => Promise<Page>)

type MiddlewareResult =
    | MiddlewareResponseValue  // short-circuit with a response
    | null                     // pass to next middleware
    | undefined;               // pass to next middleware


export type Middleware = {
    name: string
    handler: MiddlewareHandler
}

export type MiddlewareHandler = (context: ContextProps) => MiddlewareResult | Promise<MiddlewareResult>;

