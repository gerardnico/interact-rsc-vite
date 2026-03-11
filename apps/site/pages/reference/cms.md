---
title: CMS
---

## Provider Plugin

You can create a provider plugin with a file:

* that exports a handler function that accepts a props object
* and returns a function that accepts a web api request and returns an object:
  * with as default, a mandatory React Element
  * and optionally, a [frontmatter](frontmatter.md) and a `toc`

```javascript
// ./src/cms/my-provider.js
export async function handler(props) {
    return async (request) => {
        // fetch your data
        const data = await fetch(new URL(request.url).pathname)
        return {
            frontmatter: {
                layout: "holy"
            },
            default: () => {
                // Optionally parse them and create a React component or return HTML directly
                return (
                    <div dangerouslySetInnerHTML={data}></div>
                )
            }
        }
    }
}
```

You can take a look to the `localPageCmsMiddleware.tsx` file, it's a CMS plugin
that returns local [Markdown](markdown.md) file as page.

