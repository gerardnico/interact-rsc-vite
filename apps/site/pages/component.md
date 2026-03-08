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

| Name       | Type       | Description                                                           |
|------------|------------|-----------------------------------------------------------------------|
| `layout`   | `template` | Top components of every page                                          |
| `partials` | `template` | Sub-components used in layout components (toc, aside, ...).           |
| `leaf`     | `content`  | Leaf Components (They are available in Markdown file (`md` or `mdx`)) |

Note:

* Layout component should return the `html` document. They can be used in the `layout` property of
  the [page frontmatter](frontmatter.md)