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

## Custom

### Add a Markdown component

You can add a component to be used in Markdown by defining them as `markdown` component in the
`components` section of the [configuration file](conf.md).

See [How to add a content component](../howto/add-a-markdown-component.md)

### Override the default with your own component

You can override the [default html](markdown-syntax.md) to bring your own by defining them in the
`components` section of the [configuration file](conf.md).

Example on how to change the `pre` component (for code block syntax highlighting)

```json
{
  "components": {
    "pre": {
      "importPath": "src/component/MyCodeComponent.js",
      "type": "markdown"
    }
  }
}
```

## Support

### Expected component `xxx` to be defined

If you get this error:

```
Error: Expected component `xxx` to be defined: you likely forgot to import, pass, or provide it.
```

The possible causes are:

* the component is [not registered](../howto/add-a-markdown-component.md#register-it)
* the component is not exported as `default`:

Example:

* Bad

```javascript
export async function Svg({}) {
    // body
}
```

* Good

```javascript
export default async function Svg({}) {
    // body
}
```