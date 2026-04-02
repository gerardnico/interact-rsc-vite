---
title: How to create a component for your Markdown pages?
---


This example shows you how to add a simple `Planet` [Markdown component](../reference/markdown-component.md) that yields
the word `Pluto`.

## Steps

### Create your component

Below is a simple `Planet` React Component that returns `Pluto`

```javascript
// src/components/Planet.js
export default function Planet() {
    return "Pluto"
}
```

Rules:

* The component should be exported as default (ie `export default`).
* If it's an interactive component that relies on Browser event (for click), you need to add
  the [use client directive](https://react.dev/reference/rsc/server-components#adding-interactivity-to-server-components)
* The component file name should have the extension `jsx`, `tsx` or `js`.

### Register it

To register it automatically, you can save it in the [markdown component directory](../reference/directory-layout.md)
(By default, `src/components/markdowns`)

You can also register it manually by:

* adding it in the `components` section of the [configuration file](../reference/conf.md)
* and setting the [type](../reference/component.md#type) to `markdown`

```json
{
  "components": {
    "Planet": {
      "importPath": "src/components/Planet.js",
      "type": "markdown"
    }
  }
}
```

### Verify the registration

You should see your component in the config list.

```bash
interact config --filter="components"
```

### Use it

You can now use it in a [Markdown page](../reference/markdown.md)

```markdown
<Planet/>
```

It will yield: <Planet/>

## Credits

This example is based on the [example of the official mdx documentation](https://mdxjs.com/guides/injecting-components/)