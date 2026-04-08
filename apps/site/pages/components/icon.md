---
title: Icon Component
---

An `icon` component is an [SVG component](svg.md) that:

* is [styled to be seen as a character](#why-another-styling).
* has a default size of `24`

And it's one way of [rendering an icon](../reference/icon.md).

## Example / Usage

* Store your icon in the [image directory](../reference/directory-layout.md)
* Use the `Icon` element

```markdown
A right arrow circle <Icon src="arrow-right-circle.svg" size="20"/>
```

Output:

A right arrow circle <Icon src="arrow-right-circle.svg" size="20"/>

### Props

All standard SVG attributes
can be applied as props. See the list of SVG Presentation Attributes
on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

## Markdown Support

This component is [registered as Markdown component](../reference/markdown-component.md) and can be used in
a [markdown page](../reference/markdown.md)

## Why another styling?

By default, styling systems set the `svg` as being a block image and not as a character.
The icon component makes it a character.

Example with [preflight](https://tailwindcss.com/docs/preflight#images-are-block-level)