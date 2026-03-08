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

Example on how to add the `Planet` component

* Create your component

```javascript
// src/components/Planet.js
export function Planet() {
    return "Pluto"
}
```

* Define it in the [configuration file](conf.md).

```json
{
  "components": {
    "Pluto": {
      "importPath": "src/component/Planet.js",
      "type": "leaf"
    }
  }
}
```

* You can now use it in [markdown page](markdown.md)

```markdown
<Planet/>
```

It will yield `Pluto`

## Type

* `layout` components are the top components of every page and should include `html`. The can be used in the `layout`
  property of the [page frontmatter](frontmatter.md)
* `leaf` components are available in Markdown file (`md` or `mdx`)