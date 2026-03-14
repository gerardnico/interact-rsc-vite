import Head from "../Head/Head.js";
import type {TemplateProps} from "../../types/index.js";
import styles from "./Holy.module.css"
import {PAGE_CONTAINER} from "../classNames.js";

import clsx from "clsx";
import {Aside} from "../Aside/Aside.js";
import {Header} from "../Header/Header.js";
import Toc from "../Toc/index.js";
import NavBar from "../NavBar/index.js";
import {interactConfig} from "interact:config";

/**
 * Holy Layout Components
 */
export default async function Holy(layoutProps: TemplateProps) {

    const PageComponent = layoutProps.page.default;
    return (
        <html lang="en" dir="ltr">
        <Head {...layoutProps} />
        <body>
        <NavBar {...layoutProps} />
        <div id="page-core" className={
            clsx(styles['pageCore'],
                PAGE_CONTAINER,
                interactConfig.style.container.containerClass,
                "position-relative mt-3"
            )}>
            <aside id="page-side" className={clsx(styles['pageSide'], "d-print-none")}>
                <Aside {...layoutProps}/>
            </aside>
            <main id="page-main" className={styles['pageMain']}>
                <div id="main-header" className={styles['mainHeader']}>
                    <Header {...layoutProps} />
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
                        "d-print-none"
                    )}>
                </div>
                <footer id="main-footer" className={
                    clsx(
                        styles['mainFooter'],
                        "d-print-none"
                    )}>
                </footer>
            </main>
        </div>
        </body>
        </html>
    )
}
