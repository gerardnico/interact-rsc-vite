---
title: Svg Reference
---

## How to render an SVG?

To render a SVG, you can:

* use one of the following components in a [markdown page](md-page.md):
  * [Svg](../components/svg.md)
  * [Icon](../components/icon.md) (If you want your SVG to be seen as a text character)
* [import a svg file](#import) in a [programmatic page](page-module.md)

## Options

### Optimization

The `svg` are optimized with the [svgo preset](https://svgo.dev/docs/preset-default/)

* on [import](#import)
* with the following components
  * [Svg](../components/svg.md)
  * [Icon](../components/icon.md)

### Import

On file import, the SVG are transformed as React Component with [SvgR](https://react-svgr.com/docs/what-is-svgr/)

Example:

* With the below import statement, `OpenAiIcon` is a React component [optimized](#optimization)

```jsx
import OpenAiIcon from "bootstrap-icons/icons/openai.svg"

export default function MyIcon() {
    return <OpenAiIcon width={24}/>
}
```

* or from a file

````jsx
import Arrow from "./arrow-right-circle.svg"

export default function svgPage() {
    return (
        <Arrow width={10}/>
    )
}
````

