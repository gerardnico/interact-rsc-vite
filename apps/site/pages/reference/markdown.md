---
title: Markdown Pages
---

`Markdown` pages are [pages](page.md) that are written with the [Markdown syntax](markdown-syntax.md)

## File Types

We support the following 2 Markdown files type:

* [Markdown (.md)](md-page.md)
* [Mdx (.mdx)](mdx.md)

## Common

### Common Syntax

They all share the common [Markdown syntax](markdown-syntax.md)

Note that you can add support for more with [unified plugins](remark-rehype-unified.md).
By [default](remark-rehype-unified.md#default), we apply the [Remark Gfm](https://github.com/remarkjs/remark-gfm) plugin
to add
the [GitHub Syntax](https://github.github.com/gfm/)

### Custom components

You can create your own components to be used in Markdown content.

We call them [markdown component](markdown-component.md).

They are recognized by the [2 Markdown file types](#file-types)

### Remark and Rehype Plugins

You can change how Markdown is parsed with [remark and rehype plugins](remark-rehype-unified.md).

The plugins are applied to all Markdown files.

### AI Agent Support

We also create Markdown version of every page for consumption by [Ai Agent](ai.md#markdown-format-for-all-pages).

