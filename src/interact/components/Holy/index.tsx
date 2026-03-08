import Head from "../Head/Head.js";
import type {TemplateProps} from "../../types/index.js";
import styles from "./Holy.module.css"
import {PAGE_CONTAINER} from "../classNames.js";

import clsx from "clsx";
import {Aside} from "../Aside/Aside.js";
import {Header} from "../Header/Header.js";
import {Toc} from "../Toc/Toc.js";
import NavBar from "../Navbar/NavBar.js";
import {interactConfig} from "interact:config";
import type {InteractConfigType} from "../../config/configSchema.js";
/**
 * Otherwise we don't get any TypeScript error
 */
let interactConfigTyped = interactConfig as InteractConfigType;
/**
 * Holy Layout Components
 */
export default async function Holy(layoutProps: TemplateProps) {

    const Component = layoutProps.pageModule.default;
    return (
        <html lang="en" dir="ltr">
        <Head {...layoutProps} />
        <body>
        <NavBar {...layoutProps} />
        <div id="page-core" className={
            clsx(styles['pageCore'],
                PAGE_CONTAINER,
                interactConfigTyped.style.container.containerClass,
                "position-relative mt-3"
            )}>
            <aside id="page-side" className={clsx(styles['pageSide'], "d-print-none")}>
                <Aside {...layoutProps}/>
            </aside>
            <main id="page-main" className={styles['pageMain']}>
                <Header {...layoutProps} />
                <div id="main-toc">
                    <Toc {...layoutProps} />
                </div>
                <div id="main-content">
                    {Component && <Component request={layoutProps.request}/>}
                </div>
                <div id="main-side" className="d-print-none">
                </div>
                <footer id="main-footer" className="d-print-none">
                </footer>
            </main>
        </div>
        </body>
        </html>
    )
}
