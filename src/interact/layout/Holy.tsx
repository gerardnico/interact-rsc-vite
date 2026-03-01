
/**
 * Holy Layout
 */
export async function Holy({Component}:{Component: React.ComponentType}) {

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>RSC MDX SSG</title>
        </head>
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
            <Component/>
        </main>
        </body>
        </html>
    )
}
