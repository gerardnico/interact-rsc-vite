import type {TemplateProps} from "../../types/index.js";

/**
 * Landing Layout
 */
export default async function Landing({page}: TemplateProps) {
    let Component = page.default
    let frontmatter = page.frontmatter || {}
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>{frontmatter?.title}</title>
        </head>
        <body>
        <header style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <h1>
                <a href="/">Landing</a>
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
