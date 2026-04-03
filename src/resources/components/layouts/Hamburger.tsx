import type {LayoutProps} from "@combostrap/interact/types";
import {getInteractConfig} from "@combostrap/interact/config";
import Header from "../partials/Header";
import Body from "../partials/Body";
import Html from "../partials/Html";
import Head from "../partials/Head";
import {cn} from "@/lib/utils";

/**
 * Hamburger Layout
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function Hamburger(layoutProps: LayoutProps) {
    let Component = layoutProps.page.default
    let interactConfig = getInteractConfig();
    return (
        <Html {...layoutProps}>
            <Head {...layoutProps}/>
            <Body {...layoutProps}>
                <Header {...layoutProps} />
                <div className={
                    cn(
                        interactConfig.style.container.containerClass,
                        "position-relative",
                    )}>
                    <main>
                        <Component {...layoutProps.context}/>
                    </main>
                </div>
            </Body>
        </Html>
    )
}
