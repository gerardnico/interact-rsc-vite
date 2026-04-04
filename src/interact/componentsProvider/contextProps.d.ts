// don't use the relative path (not resolved)
import type {FinalPage} from "../pages/interactPage.js";

// Parsed request information used to route between RSC/SSR rendering.
// Created by parseRenderRequest() from incoming HTTP requests.
export type RscProps = {
    isRsc: boolean // true if request should return RSC payload (via _.rsc suffix)
    isAction: boolean // true if this is a server action call (POST request)
    actionId?: string // server action ID from x-rsc-action header
}

/**
 * The context request props
 * These props are passed to:
 * * Middleware
 * * and finally to layout and partials components
 * Page is not in the context because it receives it as props
 */
export type ContextProps = {
    request: Request, // the original request
    // the routing normalized URL (with _.rsc suffix removed, no base, rewrite url, host may be fake)
    url: URL
    rsc: RscProps
    response: {
        status?: number
        headers?: HeadersInit;
    }
};


export type LayoutProps = {
    page: FinalPage
    context: ContextProps
};