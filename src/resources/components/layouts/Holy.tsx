import type {ContextProps} from "@combostrap/interact/types";
import styles from "./Holy.module.css"
import clsx from "clsx";
import {getInteractConfig} from "@combostrap/interact/config";
import Header from "@/components/partials/Header";
import Body from "@/components/partials/Body";
import Html from "@/components/partials/Html";
import Head from "@/components/partials/Head";
import Aside from "@/components/partials/Aside";
import Hero from "@/components/partials/Hero";
import Toc from "../partials/Toc.js";

/**
 * Holy Layout Components
 */
// noinspection JSUnusedGlobalSymbols - dynamically imported
export default async function Holy(contextProps: ContextProps) {

    const PageComponent = contextProps.page.default;
    return (
        <Html {...contextProps}>
            <Head {...contextProps}/>
            <Body {...contextProps}>
                <Header {...contextProps} />
        <div id="page-core" className={
            clsx(styles['pageCore'],
                getInteractConfig().style.container.containerClass,
                "position-relative mt-3"
            )}>
            <aside id="page-side" className={clsx(styles['pageSide'], "print:hidden")}>
                <Aside {...contextProps}/>
            </aside>
            <main id="page-main" className={styles['pageMain']}>
                <div id="main-header" className={styles['mainHeader']}>
                    <Hero {...contextProps} />
                </div>
                <div id="main-toc" className={styles['mainToc']}>
                    <Toc {...contextProps} />
                </div>
                <div id="main-content" className={styles['mainContent']}>
                    {PageComponent && <PageComponent request={contextProps.request}/>}
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
            </Body>
        </Html>
    )
}
