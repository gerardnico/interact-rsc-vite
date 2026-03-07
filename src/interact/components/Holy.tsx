
import Head from "./Head.js";
import type {LayoutProps} from "../types/index.js";


/**
 * Holy Layout
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
        <main>
            <Component request={layoutProps.request}/>
        </main>
        </body>
        </html>
    )
}
