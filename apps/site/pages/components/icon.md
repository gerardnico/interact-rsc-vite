---
title: Icon Component
---


An `icon` component is an [SVG component](svg.md) that is styled to be seen as a character.

It's registered as a [markdown component](../reference/markdown-component.md).

## Example / Usage

* Store your icon in the [image directory](../reference/directory-layout.md)
* Use the `Icon` element

```markdown
A right arrow circle <Icon src="arrow-right-circle.svg" width="20"/>
```

Output:

A right arrow circle <Icon src="arrow-right-circle.svg" width="20"/>

## Why another styling?

By default, styling systems set the `svg` as being a block image and not as a character.
The icon component makes it a character.
