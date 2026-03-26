import type {ContextProps} from "@combostrap/interact/types";
import styles from "./Holy.module.css"
import clsx from "clsx";
import {NavBar, Toc, Head, Aside, Hero} from "interact:components"
import {getInteractConfig} from "@combostrap/interact/config";

/**
 * Holy Layout Components
 */
// noinspection JSUnusedGlobalSymbols - dynamically imported
export default async function Holy(layoutProps: ContextProps) {

    const PageComponent = layoutProps.page.default;
    return (
        <html lang="en" dir="ltr">
        <Head {...layoutProps} />
        <body>
        <NavBar {...layoutProps} />
        <div id="page-core" className={
            clsx(styles['pageCore'],
                getInteractConfig().style.container.containerClass,
                "position-relative mt-3"
            )}>
            <aside id="page-side" className={clsx(styles['pageSide'], "print:hidden")}>
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
                    {PageComponent && <PageComponent request={layoutProps.request}/>}
                </div>
                <div id="main-side" className={
                    clsx(
                        styles['mainSide'],
                        "print:hidden"
                    )}>
                </div>
                <footer id="main-footer" className={
                    clsx(
                        styles['mainFooter'],
                        "print:hidden"
                    )}>
                </footer>
            </main>
        </div>
        </body>
        </html>
    )
}
