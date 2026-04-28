import htmlToMarkdown from "@/markdown/htmlToMarkdown";

console.log("Entry rsc loaded")

/**
 * Implement renderToReadableStream
 * https://react.dev/reference/react-dom/server/renderToReadableStream
 */
import {
    createTemporaryReferenceSet,
    decodeAction,
    decodeFormState,
    decodeReply,
    loadServerAction,
    renderToReadableStream
} from '@vitejs/plugin-rsc/rsc'

import type {RscPayload} from '../shared/types.js'
import type {ReactFormState} from 'react-dom/client'
import {getRootResponse, getStaticPaths} from "./handler.js";
import {getInteractConfig} from "../../../interact/config/interactConfig";
import type {ContextProps} from "../../../interact/componentsProvider/contextProps";
import {HEADER_ACTION_ID, URL_RSC_POSTFIX} from "../shared/shared-const";
/**
 * We export it so that static rendering (SSG)
 * can use it to render each page after the build
 * using the build module
 */
export {getStaticPaths}


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

/**
 * Handle the HTTP request
 * * on the dev server, the request from the dev server,
 * * on prod, this handler needs to be added as middleware
 *
 * @param request - Web Api Request
 */
export default async function handler(request: Request): Promise<Response> {

    /**
     * Differentiate between:
     * * a browser call after hydration (RSC)
     * * and an initial request (SSR)
     * thanks to a prefix added to the URL by the client
     */
    const contextProps = parseRenderRequest(request)

    /**
     * handle server/action function request
     */
    let returnValue: RscPayload['returnValue'] | undefined
    let formState: ReactFormState | undefined
    let temporaryReferences: unknown | undefined
    let actionStatus: number | undefined
    if (contextProps.meta.isRscAction) {
        if (contextProps.meta.rscActionId) {
            // action is called via `ReactClient.setServerCallback`.
            const contentType = request.headers.get('content-type')
            const body = contentType?.startsWith('multipart/form-data')
                ? await request.formData()
                : await request.text()
            temporaryReferences = createTemporaryReferenceSet()
            const args = await decodeReply(body, {temporaryReferences})
            const action = await loadServerAction(contextProps.meta.rscActionId)
            try {
                const data = await action.apply(null, args)
                returnValue = {ok: true, data}
            } catch (e) {
                returnValue = {ok: false, data: e}
                actionStatus = 500
            }
        } else {
            // otherwise server function is called via `<form action={...}>`
            // before hydration (e.g. when JavaScript is disabled).
            // aka progressive enhancement.
            const formData = await request.formData()
            const decodedAction = await decodeAction(formData)
            try {
                const result = await decodedAction()
                formState = await decodeFormState(result, formData)
            } catch (e) {
                // there's no single general obvious way to surface this error,
                // so explicitly return classic 500 response.
                return new Response('Internal Server Error: server action failed', {
                    status: 500,
                })
            }
        }
    }

    /**
     * Get the response (a page or a response)
     */
    let rootResponse = await getRootResponse(contextProps)
    if (rootResponse instanceof Response) {
        return rootResponse
    }

    /**
     * Serialize React VDOM to RSC stream
     */
    const rscPayload: RscPayload = {
        root: rootResponse,
        formState,
        returnValue,
    }
    const rscStream = renderToReadableStream<RscPayload>(rscPayload)

    /**
     * This is a request made by our client (entry.browser.tsx)
     * that asks for a Rsc format (ie by adding the {@link URL_POSTFIX} in the URL)
     * We send an RSC Payload: a compact binary representation of the rendered React Server Components tree.
     */
    if (contextProps.meta.isRsc) {
        return new Response(rscStream, {
            status: actionStatus,
            headers: {
                'content-type': 'text/x-component;charset=utf-8',
            },
        })
    }


    /**
     * This is not a request made by our client asking for an RSC stream
     * Rendering the stream as HTML
     */
    const ssr = await import.meta.viteRsc.loadModule<typeof import('./entry.ssr.tsx')>('ssr', 'index')
    const ssrResult = await ssr.renderHtml(rscStream, {
        formState,
        // allow quick simulation of JavaScript disabled browser
        debugNojs: contextProps.url.searchParams.has('__nojs'),
    })

    /**
     * Status
     * Getting the root page may return a status and the transformation as stream also
     * We combine them
     */
    let combinedStatus = contextProps.response.status != null && contextProps.response.status != 200 ? contextProps.response.status : ssrResult.status;

    /**
     * react-dom/server is not supported in React Server Components environment
     * We need to move that in entry.ssr.tsx SSR if we want to use react-dom/server
     */
    if (contextProps.meta.isMarkdown) {
        const html = await new Response(ssrResult.stream).text();
        const mdString = htmlToMarkdown(html)
        return new Response(mdString, {
            status: combinedStatus,
            headers: {
                'Content-Type': 'text/markdown; charset=utf-8',
                ...contextProps.response.headers,
            }
        })
    }

    /**
     * Return
     */
    return new Response(ssrResult.stream, {
        status: combinedStatus,
        headers: {
            'content-type': 'text/html;charset=utf-8',
            ...contextProps.response.headers,
        },
    })
}

/**
 * Return both rsc and html streams at once
 * for SSG (static rendering)
 */
export async function handleSsg(request: Request): Promise<{
    html: ReadableStream<Uint8Array>
    rsc: ReadableStream<Uint8Array>
    md: string | undefined
}> {

    /**
     * HTML request
     */
    const contextProps = parseRenderRequest(request)
    let rootResponse = await getRootResponse(contextProps)
    if (rootResponse instanceof Response) {
        throw new Error("A page request should not return a Web Fetch API Response")
    }
    const rscPayload: RscPayload = {root: rootResponse}
    const rscStream = renderToReadableStream<RscPayload>(rscPayload)
    const [rscStream1, rscStream2] = rscStream.tee()

    const ssr = await import.meta.viteRsc.loadModule<typeof import('./entry.ssr')>('ssr', 'index')
    const ssrResult = await ssr.renderHtml(rscStream1, {ssg: true})

    /**
     * Markdown
     */
    contextProps.meta.isMarkdown = true
    contextProps.url = new URL(contextProps.url.pathname + ".md", "http://ssg-markdown.local")
    let markdownRootResponse = await getRootResponse(contextProps)
    if (markdownRootResponse instanceof Response) {
        throw new Error("A markdown request should not return a Web Fetch API Response")
    }
    const markdownRscPayload: RscPayload = {root: markdownRootResponse}
    const markdownRscStream = renderToReadableStream<RscPayload>(markdownRscPayload)

    const markdownSsrResult = await ssr.renderHtml(markdownRscStream, {ssg: true})
    const markdownHtml = await new Response(markdownSsrResult.stream).text();
    let mdString
    try {
        mdString = htmlToMarkdown(markdownHtml)
    } catch (e) {
        // Error: Cannot handle unknown node `table`
        console.error("Error generating the markdown file.", e)
    }

    /**
     * Response
     */
    return {html: ssrResult.stream, rsc: rscStream2, md: mdString}
}

// https://vite.dev/guide/api-hmr#required-conditional-guard
if (import.meta.hot) {
    // HMR code
    // https://vite.dev/guide/api-hmr#hot-accept-cb
    // Empty accept callback is we want to accept, but we don't have to do anything.
    import.meta.hot.accept()
}
