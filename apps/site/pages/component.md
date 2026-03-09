---
title: Components
---

## Provider

All components are provided via the components module.

```javascript
import {Code} from "interact:components"
```

## Override

You can override them to bring your own by defining them in the
`components` section of the [configuration file](conf.md).

Example on how to change the `pre` component (for code block syntax highlighting)

```json
{
  "components": {
    "pre": {
      "importPath": "src/component/MyCodeComponent",
      "type": "leaf"
    }
  }
}
```

## Add a Markdown component

You can add a component to be used in Markdown by defining them as `leaf` component in the
`components` section of the [configuration file](conf.md).

See [](howto/add-a-markdown-component.md)

## Type

| Name                | Type       | Description                                                                 |
|---------------------|------------|-----------------------------------------------------------------------------|
| [layout](layout.md) | `template` | Top components of every page                                                |
| `partials`          | `template` | Sub-components used in layout components (toc, aside, ...).                 |
| `content`           | `content`  | Components made available in Markdown files (`md` or `mdx`))                |
| `page`              | `page`     | Components that exports also frontmatter and toc (Example: `NotFound` page) |

Note:

* Layout component should return the `html` document. They can be used in the `layout` property of
  the [page frontmatter](frontmatter.md)

## Support

### Expected component `xxx` to be defined

If you get this error:

```
Error: Expected component `xxx` to be defined: you likely forgot to import, pass, or provide it.
```

The possible causes are:

* the component is [not registered](howto/add-a-markdown-component.md#register-it)
* the components is not exported as `default`:

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