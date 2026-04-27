import type {LayoutProps} from "@combostrap/interact/types";
import styles from "./Holy.module.css"
import {getInteractConfig} from "@combostrap/interact/config";
import Header from "@combostrap/interact/components/partials/Header";
import Body from "@combostrap/interact/components/partials/Body";
import Html from "@combostrap/interact/components/partials/Html";
import Head from "@combostrap/interact/components/partials/Head";
import Aside from "@combostrap/interact/components/partials/Aside";
import Hero from "@combostrap/interact/components/partials/Hero";
import Toc from "../partials/Toc.js";
import {cn} from "@/lib/utils";
import Footer from "@/components/partials/Footer";

/**
 * Holy Layout Components
 */
// noinspection JSUnusedGlobalSymbols - dynamically imported
export default function Holy(layoutProps: LayoutProps) {

    return (
        <Html {...layoutProps}>
            <Head {...layoutProps}/>
            <Body {...layoutProps}>
                <Header {...layoutProps} />
                <div id="page-core" className={
                    cn(styles['pageCore'],
                        getInteractConfig().template.container.containerClass,
                        "position-relative mt-3"
                    )}>
                    <aside id="page-side" className={cn(styles['pageSide'], "print:hidden")}>
                        <Aside {...layoutProps}/>
                    </aside>
                    <main id="page-main" className={styles['pageMain']}>
                        <div id="main-header" className={styles['mainHeader']}>
                            <Hero {...layoutProps} />
                        </div>
                        <div id="main-toc" className={styles['mainToc']}>
                            <Toc {...layoutProps} />
                        </div>
                        <div id="main-content" className={styles['mainContent']}>
                            {layoutProps.page.contentElement}
                        </div>
                        <div id="main-side" className={
                            cn(
                                styles['mainSide'],
                                "print:hidden"
                            )}>
                        </div>
                        <footer id="main-footer" className={
                            cn(
                                styles['mainFooter'],
                                "print:hidden"
                            )}>
                        </footer>
                    </main>
                </div>
                <Footer {...layoutProps} />
            </Body>
        </Html>
    )
}
