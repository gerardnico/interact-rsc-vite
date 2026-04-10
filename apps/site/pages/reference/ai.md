---
title: AI Agent Support
---


## Features

### Markdown format for all pages

All [pages](page.md) gets by default a Markdown version.

The Markdown version can be asked:

* by adding tne `md` at the end of the URL path
* by setting the `accept` request header to `text/markdown`

The elements that have the class `print:hidden` are not part of the output.

Every HTML page announces this alternate version in a link head element:

Example:

```html

<link rel="alternate" type="text/markdown" href="/index.md">
```

This alternate version is then used by the [Open Component](../components/page-menu-button.mdx)

The [static server generation](build.md#static-server-generation) generates also the Markdown version

### Page Button Component

The [page button component](../components/page-menu-button.mdx) is a button that permits to:

* copy the page as Markdown
* open the page in a chatbot
