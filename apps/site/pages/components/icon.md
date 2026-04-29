---
title: Icon Component
---

An `icon` component is an [SVG component](svg.md) that:

* is [styled to be seen as a character](#why-another-styling) with our `icon` class.
* accept a `size` attribute to set the `width` and `height` at once

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

## Vertical Alignement

By default, the vertical alignment is set to [baseline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/vertical-align#baseline)
but you can change it with any [vertical-align tailwind class](https://tailwindcss.com/docs/vertical-align)

```markdown
Bottom Aligned Arrow  <Icon src="arrow-right-circle.svg" class="align-bottom" size="20"/>
```

Output:

Bottom Aligned Arrow <Icon src="arrow-right-circle.svg" class="align-bottom" size="20"/>

## Why another styling?

By default, styling systems set the `svg` as being a block image and not as a character.
Example with [preflight preset](https://tailwindcss.com/docs/preflight#images-are-block-level)

The icon component makes it a character by applying the following properties:

```css
.icon {
    display: inline-block;
    vertical-align: baseline;
}
```

