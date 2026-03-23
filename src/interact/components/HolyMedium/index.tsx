import Head from "@combostrap/interact/components/Head";
import type {TemplateProps} from "@combostrap/interact/types";
import styles from "./holyMedium.module.css"
import {PAGE_CONTAINER_CLASS_NAME} from "../classNames.js";

import clsx from "clsx";
import {Header} from "../Header/Header.js";
import Toc from "../Toc/index.js";
import NavBar from "../NavBar/index.js";
import {getInteractConfig} from "@combostrap/interact/config";
import Html from "../Html/index.js";


/**
 * Holy Layout Components without the sidebar
 */
// noinspection JSUnusedGlobalSymbols -
export default async function HolyMedium(layoutProps: TemplateProps) {

    const PageComponent = layoutProps.page.default;
    const noHero = (layoutProps.page.frontmatter?.layoutHeroDisabled || "false") == "true"
    return (
        <Html {...layoutProps}>
            <Head {...layoutProps} />
            <body className={"holy-medium"}>
            <NavBar {...layoutProps} />
            <div id="page-core" className={
                clsx(styles['pageCore'],
                    PAGE_CONTAINER_CLASS_NAME,
                    getInteractConfig().style.container.containerClass,
                    "position-relative mt-3"
                )}>
                <main id="page-main" className={styles["pageMain"]}>
                    {!noHero && (
                        <div id="main-header" className={styles['mainHeader']}>
                            <Header {...layoutProps} />
                        </div>
                    )}
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
            </body>
        </Html>
    )
}
