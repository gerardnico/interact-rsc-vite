import type {ContextProps} from "@combostrap/interact/types";
import {Head, Html, Body, NavBar} from "interact:components";
import clsx from "clsx";
import {getInteractConfig} from "@combostrap/interact/config";

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
                <NavBar {...contextProps} />
                <div id="page-trunk" className={
                    clsx(
                        interactConfig.style.container.containerClass,
                        "position-relative"
                    )}>
                    <main>
                        <Component request={contextProps.request}/>
                    </main>
                </div>
            </Body>
        </Html>
    )
}
