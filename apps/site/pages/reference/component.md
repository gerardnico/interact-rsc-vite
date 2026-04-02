---
title: Components System
---

Components are the blocks that builds the entire HTML document
served to the user.

## GUI Tree

The [layout component](layout.md) is the top/root component:

* that wraps one or more [partials](layout.md#partials)
* that wraps a [page](page.md)
* where [markdown components](markdown-component.md) are used

## Author and Designer

The author writes [pages](page.md) while the designer designs:

* `layout`,
* `partial`
* and `markdown` components.

## Concept

### Type

| Name                              | Description                                                                        |
|-----------------------------------|------------------------------------------------------------------------------------|
| [layout](layout.md)               | Top/root components of every page (return the `html` document)                     |
| [partials](layout.md#partials)    | Sub-components used in layout components (toc, aside, ...).                        |
| [page](page.md)                   | Components that exports a frontmatter and a toc (Example: [NotFound page](404.md)) |
| [markdown](markdown-component.md) | Components made available in [Markdown files](markdown.md) (`md` or  `mdx`))       |

### Server vs Client

Interact is built on top of [React Server Components](rsc.md).

By default, the components run on the server and are never included in a HTML document.
If you want to make them interactive and ship them to the browser, you need to declare them as
`client` component with the [client directive](rsc.md#use-client)

Example:

<!-- Note this file is written in md, not mdx otherwise rsc would have recognized the 'use client' directive -->

```jsx
'use client' // Client Component directive
import React from 'react'

export function Counter() {

    const [count, setCount] = React.useState(0)

    return (
        <button className="p-3 rounded-4xl bg-primary text-primary-foreground"
                onClick={() => setCount((c) => c + 1)}>
            Click Me ! Count is {count}
        </button>
    )

}

```

Once you have [registered it as Markdown component](../howto/add-a-markdown-component.md#register-it), you can even use
it in Markdown Pages

Demo:

```jsx
<Counter/>
```

<Counter/>


<br/>

## Custom Markdown Rendering

You can set or add a component to be used in Markdown
See [How to map or add a Markdown component](markdown-component.md#how-to)
