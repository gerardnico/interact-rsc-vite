---
title: Public directory
---

`public` is a [directory](directory-layout.md) that contains files that are not processed.

Basically, all files
that references your pages except [raster image](../components/raster.md) and [svg](../components/svg.md).

## Example

A PDF located in `public/static/book.pdf` would be referenced in a [page](page.md) as :

```markdown
<a href="/static/book.pdf" download>Book</a>
```

## Usage

It's use for files:

* referenced in HTML/Markdown directly (`<link rel="icon" href="/favicon.ico">`)
* whose paths must stay stable (e.g., referenced from a CMS, email template, or external service)
* you don't want to be transformed

For example:

* pdf,
* word document
* [robots.txt](robots.md#robotstxt), 
* `sitemap.xml`, 
* [manifest.json and favicon.ico](favicons.md)


