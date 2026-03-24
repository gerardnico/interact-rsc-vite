import type {TemplateProps} from "@combostrap/interact/types";
import styles from "./holyMedium.module.css"
import clsx from "clsx";
import {Toc, NavBar, Head, Html, Hero, Body} from "interact:components";
import {getInteractConfig} from "@combostrap/interact/config";


/**
 * Holy Layout Components without the sidebar
 */
// noinspection JSUnusedGlobalSymbols -
export default async function HolyMedium(layoutProps: TemplateProps) {

    const PageComponent = layoutProps.page.default;
    return (
        <Html {...layoutProps}>
            <Head {...layoutProps} />
            <Body className={"holy-medium"} {...layoutProps}>
            <NavBar {...layoutProps} />
            <div id="page-core" className={
                clsx(styles['pageCore'],
                    getInteractConfig().style.container.containerClass,
                    "position-relative mt-3"
                )}>
                <main id="page-main" className={styles["pageMain"]}>
                    <div id="main-header" className={styles['mainHeader']}>
                        <Hero {...layoutProps} />
                    </div>
                    <div id="main-toc" className={styles['mainToc']}>
                        <Toc {...layoutProps} />
                    </div>
                    <div id="main-content" className={styles['mainContent']}>
                        {PageComponent && <PageComponent request={layoutProps.request}/>}
                    </div>
                    <footer id="main-footer" className={
                        clsx(
                            styles['mainFooter'],
                            "d-print-none"
                        )}>
                    </footer>
                </main>
            </div>
            </Body>
        </Html>
    )
}
