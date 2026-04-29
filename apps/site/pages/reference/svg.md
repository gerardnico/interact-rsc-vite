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

The `svg` are optimized

* on [import](#import)
* with the following components
  * [Svg](../components/svg.md)
  * [Icon](../components/icon.md)

The following svg configuration are applied:

* [svgo preset-default](https://svgo.dev/docs/preset-default/)
* `removeViewBox` and `removeDimensions`: ie keep or create viewBox and deletes
  the [dimensions (width and height)](#sizing)
* `removeTitle`, `removeDesc`, `removeDoctype`

## Sizing

Note that the [optimization](#optimization) deletes
the dimensions (width and height) so that the author or the parent container can control them
via

* tailwind class
* or attribute.

Example:

* Via tailwind class

```jsx
<span className={"size-[1.2em]"}><Svg src="illustration.svg"/></span>
// This example is simplistic, but you would need it if the icon name came from an external source
```

* Via attribute on the [Svg](../components/svg.md) and [Icon](../components/icon.md) components

```jsx
<Svg src="illustration.svg" width={100}/>
<Icon src="icon.svg" size={24}/>
```

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

