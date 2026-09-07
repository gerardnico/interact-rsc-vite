// Css are in the Main Component

/**
 * client module
 * It is used for hydration and client-side rendering
 * Responsible for:
 * - RSC stream deserialization (RSC stream -> React VDOM)
 * - traditional CSR (React VDOM -> Browser DOM tree mount/hydration)
 * - refetch and re-render RSC
 * - calling server functions
 */
import {
    createFromReadableStream,
    createFromFetch,
    setServerCallback,
    createTemporaryReferenceSet,
    encodeReply,
} from '@vitejs/plugin-rsc/browser'
import React from 'react'
import {createRoot, hydrateRoot} from 'react-dom/client'
import {rscStream} from 'rsc-html-stream/client' // https://github.com/devongovett/rsc-html-stream
import type {RscPayload} from '../shared/types'
import {getContextComponents} from "interact:client-contexts";
import {HEADER_ACTION_ID, URL_RSC_POSTFIX} from "../shared/shared-const.tsx";
// This stylesheet needs to be on the client side, it does not work on the server side InteractApp
import "interact:outline-numbering.css"

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


async function main() {
    // stash `setPayload` function to trigger re-rendering
    // from outside `BrowserRoot` component (e.g. server function call, navigation, hmr)
    let setPayload: (v: RscPayload) => void

    // deserialize RSC stream back to React VDOM for CSR
    const initialPayload = await createFromReadableStream<RscPayload>(
        // initial RSC stream is injected in SSR stream as <script>...FLIGHT_DATA...</script>
        rscStream,
    )

    // browser root component to (re-)render RSC payload as state
    function BrowserRoot() {
        const [payload, setPayload_] = React.useState(initialPayload)

        React.useEffect(() => {
            setPayload = (v) => React.startTransition(() => setPayload_(v))
        }, [setPayload_])

        // re-fetch/render on client side navigation
        React.useEffect(() => {
            return listenNavigation(() => fetchRscPayload())
        }, [])

        return payload.root
    }

    // re-fetch RSC and trigger re-rendering
    async function fetchRscPayload() {
        const renderRequest = createRscRenderRequest(window.location.href)
        const payload = await createFromFetch<RscPayload>(fetch(renderRequest))
        // Go to the top if this is not a fragment navigation
        if (!window.location.hash) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
        setPayload(payload)
    }

    // register a handler which will be internally called by React
    // on server function request after hydration.
    setServerCallback(async (id, args) => {
        const temporaryReferences = createTemporaryReferenceSet()
        const renderRequest = createRscRenderRequest(window.location.href, {
            id,
            body: await encodeReply(args, {temporaryReferences}),
        })
        const payload = await createFromFetch<RscPayload>(fetch(renderRequest), {
            temporaryReferences,
        })
        setPayload(payload)
        const {ok, data} = payload.returnValue!
        if (!ok) throw data
        return data
    })

    /**
     * Context wrapping
     */
    let root = (<BrowserRoot/>)
    const contextComponents = getContextComponents();
    // Sort in descending order so that the components that are first in ascending order becomes the root of the tree
    const contextKeysDescendingOrder = Object.keys(contextComponents).sort((a, b) => b.localeCompare(a));
    for (const contextComponentKey of contextKeysDescendingOrder) {
        const ContextComponent = contextComponents[contextComponentKey];
        if (ContextComponent == undefined) {
            continue
        }
        root = (
            <ContextComponent>
                {root}
            </ContextComponent>
        )
    }

    // hydration
    const browserRoot = (
        <React.StrictMode>
            {root}
        </React.StrictMode>
    )
    if ('__NO_HYDRATE' in globalThis) {
        createRoot(document).render(browserRoot)
    } else {
        hydrateRoot(document, browserRoot, {
            formState: initialPayload.formState,
        })
    }

    // implement server HMR by triggering re-fetch/render of RSC upon server code change
    if (import.meta.hot) {
        import.meta.hot.on('rsc:update', () => {
            fetchRscPayload()
        })
    }
}

function isAnchorNavigation(link: HTMLAnchorElement) {
    return link.href &&
        link.origin === window.location.origin &&
        link.pathname === window.location.pathname &&
        link.hash !== '';
}

// Helper that set up events interception for client side navigation
function listenNavigation(fetchRsc: () => void) {


    // pushState is called to navigate to a new URL without a full page reload.
    // called in the onClick function
    const oldPushState = window.history.pushState
    window.history.pushState = function (...args) {
        oldPushState.apply(this, args)
        // so that user can listen to
        window.dispatchEvent(new Event('pushstate'));
        // fetch
        fetchRsc()
    }

    // replaceState changes the current URL entry without adding a new history entry (used for redirects or URL cleanups).
    const oldReplaceState = window.history.replaceState
    window.history.replaceState = function (...args) {
        oldReplaceState.apply(this, args)
        // so that user can listen to
        window.dispatchEvent(new Event('replacestate'));
        // don't fetch, when the state is stored in the URL, you don't want to fetch
        // otherwise the whole page refresh, and you lost the URL
        // fetchRsc()
    }

    function onClick(e: MouseEvent) {
        const link = (e.target as Element).closest('a')
        if (!link) return;

        // Navigation in the same page
        const isAnchorNav = isAnchorNavigation(link);
        if (
            !isAnchorNav &&
            link instanceof HTMLAnchorElement &&
            link.href &&
            (!link.target || link.target === '_self') &&
            link.origin === location.origin &&
            !link.hasAttribute('download') &&
            e.button === 0 && // left clicks only
            !e.metaKey && // open in new tab (Mac)
            !e.ctrlKey && // open in new tab (windows)
            !e.altKey && // download
            !e.shiftKey &&
            !e.defaultPrevented
        ) {
            e.preventDefault()
            history.pushState(null, '', link.href)
        }
    }

    // When the user clicks the back button, navigate with RSC.
    // Fire on new URL (anchor link also)
    window.addEventListener('popstate', (event) => {
        // ignore change for hash-only changes
        if ((event.target as Window)?.location.hash) return;
        fetchRsc();
    })

    // On click
    document.addEventListener('click', onClick)

    return () => {
        // click = mouse click
        document.removeEventListener('click', onClick)
        // popstate = back button
        window.removeEventListener('popstate', fetchRsc)
        // restore initial state
        window.history.pushState = oldPushState
        window.history.replaceState = oldReplaceState
    }
}

await main()