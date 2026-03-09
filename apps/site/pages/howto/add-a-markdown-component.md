---
title: How to add a custom component to be used in a Markdown or Mdx page?
---

You can add a component to be used in [Markdown pages](../markdown.md) by defining them as `leaf` component in the
`components` section of the [configuration file](../conf.md).

### Steps

Example on how to add a `Planet` component that will yield the word `Pluto` (as used in the [mdx documentation](https://mdxjs.com/guides/injecting-components/)) 

### Create your component

```javascript
// src/components/Planet.js
export function Planet() {
    return "Pluto"
}
```

### Register it

You can register it by defining it in the [configuration file](../conf.md).

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

### Use it

You can now use it in [markdown page](../markdown.md)

```markdown
<Planet/>
```

It will yield `Pluto`
