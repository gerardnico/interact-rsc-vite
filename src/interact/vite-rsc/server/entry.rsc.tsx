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
import {parseRenderRequest} from '../shared/request'
import type {RscPayload} from '../shared/types'
import type {ReactFormState} from 'react-dom/client'
import {getRootComponent, getStaticPaths} from "../../pages";

/**
 * We export it so that static rendering (SSG)
 * can use it to render each page after the build
 * using the build module
 */
export {getStaticPaths}


/**
 * Handle a request against vite
 * @param request
 */
export default async function handler(request: Request): Promise<Response> {

    /**
     * Differentiate between:
     * * a browser call after hydration (RSC)
     * * and an initial request (SSR)
     * thanks to a prefix added to the URL by the client
     */
    const renderRequest = parseRenderRequest(request)

    // handle server function request
    let returnValue: RscPayload['returnValue'] | undefined
    let formState: ReactFormState | undefined
    let temporaryReferences: unknown | undefined
    let actionStatus: number | undefined
    if (renderRequest.isAction) {
        if (renderRequest.actionId) {
            // action is called via `ReactClient.setServerCallback`.
            const contentType = request.headers.get('content-type')
            const body = contentType?.startsWith('multipart/form-data')
                ? await request.formData()
                : await request.text()
            temporaryReferences = createTemporaryReferenceSet()
            const args = await decodeReply(body, {temporaryReferences})
            const action = await loadServerAction(renderRequest.actionId)
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
     * Serialize React VDOM to RSC stream
     */
    let rootComponent = getRootComponent(new URL(renderRequest.request.url))
    const rscPayload: RscPayload = {
        root: rootComponent,
        formState,
        returnValue,
    }
    const rscStream = renderToReadableStream<RscPayload>(rscPayload)

    /**
     * This is a request made our app that asks for (ie the RSC client {@see entry.browser.tsx}
     * (ie as the {@link URL_POSTFIX} in the URL)
     * We send an RSC Payload: a compact binary representation of the rendered React Server Components tree.
     */
    if (renderRequest.isRsc) {
        return new Response(rscStream, {
            status: actionStatus,
            headers: {
                'content-type': 'text/x-component;charset=utf-8',
            },
        })
    }

    /**
     * This is not a request made by our client asking for a RSC stream
     * Rendering the stream as HTML
     */
    const ssr = await import.meta.viteRsc.loadModule<typeof import('./entry.ssr')>('ssr', 'index')
    const ssrResult = await ssr.renderHtml(rscStream, {
        formState,
        // allow quick simulation of javascript disabled browser
        debugNojs: renderRequest.url.searchParams.has('__nojs'),
    })

    return new Response(ssrResult.stream, {
        status: ssrResult.status,
        headers: {
            'content-type': 'text/html;charset=utf-8',
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
}> {

    const url = new URL(request.url)
    let rootComponent = getRootComponent(url)

    const rscPayload: RscPayload = {root: rootComponent}
    const rscStream = renderToReadableStream<RscPayload>(rscPayload)
    const [rscStream1, rscStream2] = rscStream.tee()

    const ssr = await import.meta.viteRsc.loadModule<typeof import('./entry.ssr')>('ssr', 'index')
    const ssrResult = await ssr.renderHtml(rscStream1, {ssg: true})

    return {html: ssrResult.stream, rsc: rscStream2}
}

if (import.meta.hot) {
    import.meta.hot.accept()
}
