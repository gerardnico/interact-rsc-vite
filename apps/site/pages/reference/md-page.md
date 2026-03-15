---
title: Markdown Page
---


This page is about [pages](page.md) created with the [Markdown](markdown.md) extension (`.md`).

## Format

The content of a `md` file may be configured to be one of the 3 options below.
By default, we use the `mdr` format.

| Format | Description    | [Accepts Content component ?](content-component.md) | HTML  Compatibility      | Javascript                 |
|--------|----------------|-----------------------------------------------------|--------------------------|----------------------------|
| `md`   | Markdown       | No                                                  | HTML                     | No                         |
| `mdr`  | Markdown React | Yes                                                 | [XHTML](#xhtml-markdown) | No                         |
| `mdx`  | Mardown Jsx    | Yes                                                 | [XHTML](#xhtml-markdown) | Yes, without import/export |

### XHTML Markdown

Because the `mdr` and `mdx` format supports [content component](content-component.md) like `<Foo />`

* All element should be closed. `<br>` is not valid `<br/>` is
* The standard URL bracket syntax `<http://www.example.com>` is not valid
* No Markdown indented code or indented list, you need to use xhtml element

## Configuration

* The [default format](#format) may be set in the `markdown` node of the [configuration file](conf.md)
* You can also configure [remark and rehype plugins](remark-rehype-unified.md)