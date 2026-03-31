import type {ContextProps} from "@combostrap/interact/types";
import Html from "@/components/partials/Html";
import Head from "@/components/partials/Head";
import Body from "@/components/partials/Body";



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
