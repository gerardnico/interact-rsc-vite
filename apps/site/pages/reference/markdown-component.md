---
title: Markdown Component
---

Markdown component are [components](component.md#type) that can be used:

* in [mdx pages](mdx.md)
* in [md pages](md-page.md) if the chosen format is `mdr` or `mdx`

## How to

### Create your own Markdown component

See [How to add a Markdown component](../howto/add-a-markdown-component.md)

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

## Syntax

All [default syntax with gfm](markdown-syntax.md) is supported

You can also use:

* [svg](../components/svg.md) to embed and optimize SVG files
* [icon](../components/icon.md) to embed and optimize SVG files as icon
* [image](../components/image.md) to process and transform Raster Image


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