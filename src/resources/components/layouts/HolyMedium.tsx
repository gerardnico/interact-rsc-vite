import type {ContextProps} from "@combostrap/interact/types";
import styles from "./holyMedium.module.css"
import clsx from "clsx";

import {getInteractConfig} from "@combostrap/interact/config";
import Header from "../partials/Header";
import Html from "../partials/Html";
import Head from "../partials/Head";
import Body from "../partials/Body";
import Hero from "../partials/Hero";
import Toc from "../partials/Toc";


/**
 * Holy Layout Components without the sidebar
 */
// noinspection JSUnusedGlobalSymbols -
export default function HolyMedium(contextProps: ContextProps) {

    const PageComponent = contextProps.page.default;
    return (
        <Html {...contextProps}>
            <Head {...contextProps} />
            <Body className={"holy-medium"} {...contextProps}>
                <Header {...contextProps} />
                <div id="page-core" className={
                    clsx(styles['pageCore'],
                        getInteractConfig().style.container.containerClass,
                        "position-relative mt-3"
                    )}>
                    <main id="page-main" className={styles["pageMain"]}>
                        <div id="main-header" className={styles['mainHeader']}>
                            <Hero {...contextProps} />
                        </div>
                        <div id="main-toc" className={styles['mainToc']}>
                            <Toc {...contextProps} />
                        </div>
                        <div id="main-content" className={styles['mainContent']}>
                            {PageComponent && <PageComponent request={contextProps.request}/>}
                        </div>
                    </main>
                </div>
            </Body>
        </Html>
    )
}
