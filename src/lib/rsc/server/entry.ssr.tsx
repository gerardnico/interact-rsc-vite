/**
 * `ssr` module implements:
 * * traditional SSR (React VDOM to HTML string/stream)
 * * RSC stream deserialization (RSC stream -> React VDOM)
 */

import {createFromReadableStream} from '@vitejs/plugin-rsc/ssr'
import React from 'react'
import {renderToReadableStream} from 'react-dom/server.edge'
import {prerender} from 'react-dom/static.edge'
import {injectRSCPayload} from 'rsc-html-stream/server'
import type {RscPayload} from '../shared/types.js'
import type {ReactFormState} from "react-dom/client";

/**
 * Render HTML from a RSC Payload
 */
export async function renderHtml(
    rscStream: ReadableStream<Uint8Array>,
    options?: {
        ssg?: boolean,
        formState?: ReactFormState
        nonce?: string
        debugNojs?: boolean
    },
): Promise<{ stream: ReadableStream<Uint8Array>; status?: number }> {

    // duplicate one RSC stream into two.
    // - one for SSR (ReactClient.createFromReadableStream below)
    // - another for browser hydration payload by injecting <script>...FLIGHT_DATA...</script>.
    const [rscStream1, rscStream2] = rscStream.tee()

    // deserialize RSC stream back to React VDOM
    let payload: Promise<RscPayload>

    function SsrRoot() {
        // deserialization needs to be kicked off inside ReactDOMServer context
        // for ReactDomServer preinit/preloading to work
        payload ??= createFromReadableStream<RscPayload>(rscStream1)
        return React.use(payload).root
    }

    // render html (traditional SSR)
    const bootstrapScriptContent =
        await import.meta.viteRsc.loadBootstrapScriptContent('index')

    let htmlStream: ReadableStream<Uint8Array>
    let status: number | undefined
    if (options?.ssg) {
        // for static site generation, let errors throw to fail the build
        const prerenderResult = await prerender(<SsrRoot/>, {
            bootstrapScriptContent,
        })
        htmlStream = prerenderResult.prelude
    } else {
        // for regular SSR, catch errors and fallback to CSR
        try {
            htmlStream = await renderToReadableStream(<SsrRoot />, {
                bootstrapScriptContent: options?.debugNojs
                    ? undefined
                    : bootstrapScriptContent,
                nonce: options?.nonce,
                formState: options?.formState,
            })
        } catch (e) {
            // fallback to render an empty shell and run pure CSR on browser,
            // which can replay server component error and trigger error boundary.
            status = 500
            htmlStream = await renderToReadableStream(
                <html>
                <body>
                <noscript>Internal Server Error: SSR failed</noscript>
                </body>
                </html>,
                {
                    bootstrapScriptContent:
                        `self.__NO_HYDRATE=1;` +
                        (options?.debugNojs ? '' : bootstrapScriptContent),
                    nonce: options?.nonce,
                },
            )
        }
    }

    let responseStream: ReadableStream<Uint8Array> = htmlStream
    if (!options?.debugNojs) {
        // initial RSC stream is injected in HTML stream as <script>...FLIGHT_DATA...</script>
        // using utility made by devongovett https://github.com/devongovett/rsc-html-stream
        responseStream = responseStream.pipeThrough(
            injectRSCPayload(rscStream2, {
                nonce: options?.nonce,
            }),
        )
    }
    responseStream = responseStream.pipeThrough(injectRSCPayload(rscStream2))
    return {stream: responseStream, status}
}
