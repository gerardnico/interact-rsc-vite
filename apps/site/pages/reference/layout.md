---
title: Layout
---

A `layout` is the top [component](component.md) that wraps a [page](page.md)

It's also known as the `root` component because it returns the entire document including the root `<html>` tag.

## Built-in List

* Holy - Full layout
* HolyMedium - Holy layout without the sidebar
* Hamburger - Top navbar, page and footer
* Landing - Hamburger where the page is not constrained
* None: No layout applied, your page should return the `html` root element

## How to set a layout

You can set the layout by giving its name in the layout [frontmatter property](frontmatter.md)

Example:

* for a [markdown page](markdown.md)

```markdown
---
layout: holy
---
```

* for a [programmatic page](page-module.md)

```javascript
export const frontmatter = {
    layout: 'holy'
}
```

## How to create a layout

See [How to create a layout](../howto/add-a-layout.md)