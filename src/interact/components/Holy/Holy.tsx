
import Head from "../Head/Head.js";
import type {LayoutProps} from "../../types/index.js";
import styles from "./Holy.module.css"

/**
 * Holy Layout Components
 */
export default async function Holy(layoutProps: LayoutProps) {

    const Component = layoutProps.pageModule.default;
    return (
        <html lang="en" dir="ltr">
        <Head {...layoutProps} />
        <body>
        <header style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <h1>
                <a href="/">Holy</a>
            </h1>
            <span data-testid="timestamp">
            Rendered at {new Date().toISOString()}
          </span>
        </header>
        <main className={styles.pageMain}>
            <Component request={layoutProps.request}/>
        </main>
        </body>
        </html>
    )
}
