---
title: Svg Component
---


## Usage

### Markdown Page

Within a Markdown page, you can use the `Svg` component to:

* [optimize](#optimization)
* and include your svg in your document

The `src` attribute indicates the relative path to the file in the [images directory](../reference/directory-layout.md).

```markdown
<Svg src="arrow-right-circle.svg" width="40"/>
```

Output example:

<Svg src="arrow-right-circle.svg" width="40" />

### Programmatic Page

In a [programmatic page](../reference/page-module.md), importing a svg will return
an [optimized](#optimization) [React Svg Component](https://react-svgr.com/docs/what-is-svgr/)

Example:

````javascript
import Arrow from "./arrow-right-circle.svg"

export default function svgPage() {
    return (
        <Arrow width={10}/>
    )
}
````

## Props

Because icons render as SVG elements, all standard SVG attributes
can also be applied as props.

See the list of SVG Presentation Attributes on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

## Optimization

The `svg` are optimized with the [svgo preset](https://svgo.dev/docs/preset-default/)
