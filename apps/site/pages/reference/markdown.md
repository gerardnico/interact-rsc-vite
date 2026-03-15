---
title: Markdown Pages
---

`Markdown` pages are [pages](page.md) that are written based on the [Markdown syntax](markdown-syntax.md)

## File Types

We support the following 2 Markdown files type:

* [Markdown (.md)](md-page.md)
* [Mdx (.mdx)](mdx.md)

## Common

### Common Syntax

They all share the common [Markdown syntax](markdown-syntax.md)

Note that you can add support for more with [unified plugins](remark-rehype-unified.md).
By [default](remark-rehype-unified.md#default), we apply the [Remark Gfm](https://github.com/remarkjs/remark-gfm) to add
the [GitHub Syntax](https://github.github.com/gfm/)

### Content components

You can create your own components to be used in Markdown content.

We call them [content component](content-component.md).

They are recognized by the [2 Markdown files](#file-types)

### Remark and Rehype Plugins

You can change how Markdown is parsed with [remark and rehype plugins](remark-rehype-unified.md).

They will be applied to all Markdown files.
