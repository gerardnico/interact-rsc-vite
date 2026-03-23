---
title: Page Provider and CMS Binding
---

A page provider is a handler function that returns a [page](page.md).

All CMS would be implemented as a page provider.

## How to create a page Provider

You can create a provider plugin with a module:

* that exports a handler function that accepts optionally, a props object (only data, no functions)
* and returns a function that accepts a web api request and returns a [page](page.md) as object:
  * with as default, a mandatory React Element
  * and optionally, a [frontmatter](frontmatter.md) and a `toc`

```javascript
// ./src/cms/my-provider.js
export async function handler(props) {
    return async (request) => {

        const pathname = new URL(request.url).pathname

        // check if you handle the request
        if (!pathname.startsWith("/my-provider")) {
            return
        }

        // Fetch your data
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

## Example

* You can take a look to the `localPagesMiddleware.tsx` file, it's a CMS plugin that returns
  local [Markdown file as page](md-page.md).
* The [remote markdown example](https://github.com/combostrap/interact/blob/main/apps/site/cms/remote-markdown.tsx) page
  provider that returns Markdown page from GitHub.

## Registration

You can register your page provider in the `pages.providers` node of the [configuration file](conf.md)

Example:

```json
{
  "pages": {
    "providers": [
      {
        "importPath": "./cms/my-provider.js",
        "props": {
          "uri": "",
          "timeout": 1
        }
      }
    ]
  }
}
```

* They are executed in order.
* The import path is relative to the [root directory](directory-layout.md)