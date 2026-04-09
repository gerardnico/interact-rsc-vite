// don't use the relative path (not resolved)
import type {FinalPage} from "../pages/interactPage.js";


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
    // derived information
    meta: {
        isRsc: boolean // true if request should return RSC payload (via _.rsc suffix)
        isRscAction: boolean // true if this is a server action call (POST request)
        rscActionId?: string // server action ID from x-rsc-action header
        isMarkdown: boolean // true if this is a Markdown request
        lastModified?: string; // last time modified (iso string)
    } & Record<string, string | boolean | undefined>
    response: {
        status?: number
        headers?: HeadersInit;
    }
};


export type LayoutProps = {
    page: FinalPage
    context: ContextProps
};