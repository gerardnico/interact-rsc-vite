---
title: Svg Component
---

## Usage

### Markdown Page

Within a Markdown page, you can use the `Svg` component to:

* [optimize](#optimization)
* and include your svg in your document

The `src` attribute indicates the relative path to the file in the `images` directory.

```markdown
<Svg src="arrow-right-circle.svg" width="40"/>
```

Output example:

<Svg src="arrow-right-circle.svg" width="40" />

### Programmatic Page

In a [programmatic page](jsx-tsx-page.mdx), importing a svg will return
an [optimized](#optimization) [React Svg Component](https://react-svgr.com/docs/what-is-svgr/)

Example:

````javascript
import Arrow from "../images/arrow-right-circle.svg"

export default function svgPage() {
    return (
        <Arrow width={10}/>
    )
}
````

## Optimization

The `svg` are optimized with the [svgo preset](https://svgo.dev/docs/preset-default/)
