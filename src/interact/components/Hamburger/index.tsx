import type {TemplateProps} from "@combostrap/interact/types";
import {Head, Html, Body, NavBar} from "interact:components";
import clsx from "clsx";
import {getInteractConfig} from "@combostrap/interact/config";


/**
 * Hamburger Layout
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function Hamburger(templateProps: TemplateProps) {
    let Component = templateProps.page.default
    return (
        <Html {...templateProps}>
            <Head {...templateProps}/>
            <Body {...templateProps}>
                <NavBar {...templateProps} />
                <div id="page-core" className={
                    clsx(
                        getInteractConfig().style.container.containerClass,
                        "position-relative"
                    )}>
                    <main>
                        <Component request={templateProps.request}/>
                    </main>
                </div>
            </Body>
        </Html>
    )
}
