---
title: Page
---

A page is a file that is served as HTML.

It can be written in:

* [markdown](markdown.md) (md or mdx)
* [programmatically](jsx-tsx-page.mdx) (jsx, mdx)

## Layout

You can set the [layout](layout.md) by giving the layout name in the layout frontmatter property

Example:

```markdown
---
layout: holy
---
```

## Pages Directory

The pages file should be stored in the `pages` directory.

By default, the `pages` directory is the `pages` subdirectory of the [conf file directory](conf.md).
