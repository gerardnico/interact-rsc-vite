---
title: Avatar
description: An avatar is a component that renders an image as an Avatar 
---

An `avatar` is a component that renders an [raster image](image.md) as an `Avatar`.

## Styling Properties

It:
* inherits all attributes of the [image component](image.md) 
* has the `size` property that will enforce the equality `width==height`
* will position the image in the center with
  the [cover styling property](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit)
* will have a rounded circle as border.

## Syntax

The same syntax can be applied as the [image component](image.md) with the addition of the `size` attribute.

```jsx
<Avatar src="avatar.png" alt="Required Alt" size="150"/>
```

It is registered as a [markdown component](../reference/markdown-component.md) so you can use it in Markdown.

Demo:

<Avatar src="avatar.png" alt="Required Alt" size="150"/>