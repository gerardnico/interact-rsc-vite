---
title: CMS Integration
---

A `CMS` is integrated as a [middleware](middleware.md) that returns a [page](page.md).

## How to create a CMS middleware

You can create a middleware by writing a JavaScript module:

* that exports a handler function that accepts optionally, a props object (only data, no functions)
* and returns a function that accepts a web api request and returns a [page](page.md) as object:
  * with as default, a mandatory React Element
  * and optionally, a [frontmatter](frontmatter.md) and a `toc`

```tsx
// ./src/cms/my-provider.js
import {ContextProps, MiddlewareHandler} from "@combostrap/interact/types";

export async function handler(props): Promise<MiddlewareHandler> {
    return async (context: ContextProps) => {

        const pathname = context.url.pathname

        // check if you handle the request
        if (!pathname.startsWith("/my-provider")) {
            return
        }

        // Modify the context if needed
        // context.response.status = 400
        // context.response.headers

        // Fetch your data
        const data = await fetch(new URL(request.url).pathname)

        // Return your page
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

## Example

* You can take a look to the `local markdown middleware` file, it's a CMS plugin that returns
  local [Markdown file as page](md-page.md).
* The [remote Markdown example](https://github.com/combostrap/interact/blob/main/apps/site/cms/remote-markdown.tsx) page
  provider that returns Markdown page from GitHub.
