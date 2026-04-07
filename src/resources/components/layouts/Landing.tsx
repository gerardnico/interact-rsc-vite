import type {LayoutProps} from "@combostrap/interact/types";
import Html from "../partials/Html";
import Head from "../partials/Head";
import Body from "../partials/Body";
import Footer from "@/components/partials/Footer";
import Header from "@/components/partials/Header";

/**
 * Landing Layout
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function Landing(layoutProps: LayoutProps) {

    return (
        <Html {...layoutProps}>
            <Head {...layoutProps}/>
            <Body  {...layoutProps}>
                <Header {...layoutProps} />
                <main>
                    {layoutProps.page.contentElement}
                </main>
                <Footer {...layoutProps} />
            </Body>
        </Html>
    )
}
