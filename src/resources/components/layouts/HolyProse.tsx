import type {LayoutProps} from "@combostrap/interact/types";
import styles from "./holyProse.module.css"

import {getInteractConfig} from "@combostrap/interact/config";
import Header from "../partials/Header";
import Html from "../partials/Html";
import Head from "../partials/Head";
import Body from "../partials/Body";
import Hero from "../partials/Hero";
import Toc from "../partials/Toc";
import {cn} from "@/lib/utils";


/**
 * Holy Layout Components without the sidebar
 */
// noinspection JSUnusedGlobalSymbols -
export default function HolyProse(layoutProps: LayoutProps) {

    return (
        <Html {...layoutProps}>
            <Head {...layoutProps} />
            <Body className={"holy-medium"} {...layoutProps}>
                <Header {...layoutProps} />
                <div id="page-core" className={
                    cn(styles['pageCore'],
                        getInteractConfig().template.container.containerClass,
                        "position-relative mt-3"
                    )}>
                    <main id="page-main" className={styles["pageMain"]}>
                        <div id="main-header" className={styles['mainHeader']}>
                            {layoutProps.page?.frontmatter?.hero != false && <Hero {...layoutProps} />}
                        </div>
                        <div id="main-toc" className={styles['mainToc']}>
                            <Toc {...layoutProps} />
                        </div>
                        <div id="main-content" className={styles['mainContent']}>
                            {layoutProps.page.contentElement}
                        </div>
                    </main>
                </div>
            </Body>
        </Html>
    )
}
