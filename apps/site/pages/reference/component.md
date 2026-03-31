---
title: Components System
---

Components are the blocks that builds the entire HTML document
served to the user.

The `layout` component is the top/root component:

* that wraps one or more `partials`
* that wraps a `page`
* where `content` components can be used

## Author and Designer

The author writes [page](page.md) content while the designer designs `layout`, `partial` and `content` components.

## Concept

### Type

| Name                            | Type       | Description                                                                        |
|---------------------------------|------------|------------------------------------------------------------------------------------|
| [layout](layout.md)             | `template` | Top/root components of every page (return the `html` document)                     |
| `partial`                       | `template` | Sub-components used in layout components (toc, aside, ...).                        |
| `page`                          | `page`     | Components that exports a frontmatter and a toc (Example: [NotFound page](404.md)) |
| [content](content-component.md) | `content`  | Components made available in [Markdown files](markdown.md) (`md` or `mdx`))        |

### Server vs Client

Interact is built on top of [React Server Components](rsc.md).

By default, the components run on the server and are never included in a HTML document.
If you want to make them interactive and ship them to the browser, you need to declare them as
`client` component with the [client directive](rsc.md#use-client)

Example:

```js
// Client Component
'use  client' // <- If you copy this code, delete one space between use and client

import React from 'react'

export function Counter() {
    const [count, setCount] = React.useState(0)

    return (
        <button onClick={() => setCount((c) => c + 1)}>Click Me ! Count is {count}</button>
    )
}

```

Once you have [registered it](../howto/add-a-content-component.md#register-it), you can use it with

```jsx
<Counter/>
```

<Counter/>

## Custom

### Add a Markdown component

You can add a component to be used in Markdown by defining them as `content` component in the
`components` section of the [configuration file](conf.md).

See [How to add a content component](../howto/add-a-content-component.md)

### Override with your own component

You can override them to bring your own by defining them in the
`components` section of the [configuration file](conf.md).

Example on how to change the `pre` component (for code block syntax highlighting)

```json
{
  "components": {
    "pre": {
      "importPath": "src/component/MyCodeComponent.js",
      "type": "content"
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

* the component is [not registered](../howto/add-a-content-component.md#register-it)
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