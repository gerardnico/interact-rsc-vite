// Framework conventions (arbitrary choices for this demo):
// - The `_.rsc` URL suffix is used to differentiate RSC requests from SSR requests
import type {ContextProps} from "@combostrap/interact/types";
import {getInteractConfig} from "../../../interact/config/interactConfig.js";

export const URL_RSC_POSTFIX = '_.rsc'
// On a form, add the `x-rsc-action` header to pass server action ID
const HEADER_ACTION_ID = 'x-rsc-action'

/**
 * The name of the index page
 */
export const INDEX_NAME = "index"


export function createRscRenderRequest(
    urlString: string,
    action?: { id: string; body: BodyInit },
): Request {
    if (!urlString) {
        urlString = INDEX_NAME
    } else if (urlString.endsWith("/")) {
        urlString += INDEX_NAME
    }
    const url = new URL(urlString)
    url.pathname += URL_RSC_POSTFIX
    const headers = new Headers()
    if (action) {
        headers.set(HEADER_ACTION_ID, action.id)
    }
    return new Request(url.toString(), {
        method: action ? 'POST' : 'GET',
        headers,
        body: action?.body,
    })
}

/**
 * Returns if the request is an SRC request or a classic request
 * @param request
 */
export function parseRenderRequest(request: Request): ContextProps {
    const url = new URL(request.url)
    const isAction = request.method === 'POST'
    const accept = request.headers.get('accept') // or req.headers['accept'] in Express
    const wantsMarkdown = accept?.includes('text/markdown')
    let isMarkdownRequest = wantsMarkdown || request.url.endsWith('.md');

    // base set
    let base = getInteractConfig().site.base
    if (base != "/") {
        let pathname = url.pathname.slice(base.length)
        if (pathname == null) {
            // root
            pathname = "/"
        }
        url.pathname = pathname
    }

    // Classic Static Rendering Request
    if (!url.pathname.endsWith(URL_RSC_POSTFIX)) {
        return {
            meta: {
                isRsc: false,
                isRscAction: isAction,
                isMarkdown: isMarkdownRequest
            },
            request,
            url,
            response: {}
        }
    }

    // Rsc Request
    const actionId = request.headers.get(HEADER_ACTION_ID) || undefined
    if (request.method === 'POST' && !actionId) {
        throw new Error('Missing action id header for RSC action request')
    }

    // Delete Rsc Postfix
    url.pathname = url.pathname.slice(0, -URL_RSC_POSTFIX.length)

    return {
        meta: {
            isRsc: true,
            isRscAction: isAction,
            isMarkdown: isMarkdownRequest,
            rscActionId: actionId
        },
        request: request,
        url,
        response: {}
    }


}
