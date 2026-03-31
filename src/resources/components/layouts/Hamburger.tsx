import type {ContextProps} from "@combostrap/interact/types";
import {getInteractConfig} from "@combostrap/interact/config";
import Header from "../partials/Header";
import Body from "../partials/Body";
import Html from "../partials/Html";
import Head from "../partials/Head";
import {cn} from "../../lib/utils";

/**
 * Hamburger Layout
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function Hamburger(contextProps: ContextProps) {
    let Component = contextProps.page.default
    let interactConfig = getInteractConfig();
    return (
        <Html {...contextProps}>
            <Head {...contextProps}/>
            <Body {...contextProps}>
                <Header {...contextProps} />
                <div className={
                    cn(
                        interactConfig.style.container.containerClass,
                        "position-relative",
                    )}>
                    <main>
                        <Component request={contextProps.request}/>
                    </main>
                </div>
            </Body>
        </Html>
    )
}
