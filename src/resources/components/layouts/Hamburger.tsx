import type {LayoutProps} from "@combostrap/interact/types";
import {getInteractConfig} from "@combostrap/interact/config";
import Header from "@/components/partials/Header";
import Body from "@/components/partials/Body";
import Html from "@/components/partials/Html";
import Head from "@/components/partials/Head";
import {cn} from "@/lib/utils";
import Footer from "@/components/partials/Footer";

/**
 * Hamburger Layout
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function Hamburger(layoutProps: LayoutProps) {

    let interactConfig = getInteractConfig();
    return (
        <Html {...layoutProps}>
            <Head {...layoutProps}/>
            <Body {...layoutProps}>
                <Header {...layoutProps} />
                <div className={
                    cn(
                        interactConfig.template.container.containerClass,
                        "position-relative",
                    )}>
                    <main>
                        {layoutProps.page.contentElement}
                    </main>
                </div>
                <Footer {...layoutProps} />
            </Body>
        </Html>
    )
}
