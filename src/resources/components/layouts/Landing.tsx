import type {ContextProps} from "@combostrap/interact/types";
import {Head, Html, Body} from "interact:components";


/**
 * Landing Layout
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default async function Landing(contextProps: ContextProps) {
    let Component = contextProps.page.default
    return (
        <Html {...contextProps}>
            <Head {...contextProps}/>
            <Body {...contextProps}>
                <main>
                    <Component request={contextProps.request}/>
                </main>
            </Body>
        </Html>
    )
}
