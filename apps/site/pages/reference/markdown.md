---
title: Markdown Page
---


This page is about [pages](page.md) created with the Markdown extension (`.md`).
For `Markdown Jsx Page` with the `.mdx` extension, see the [mdx page](mdx.md)

## Format

We support 3 markdowns format.

| Format | Description   | [Accepts Content component ?](content-component.md) | HTML  Compatibility      | Javascript                 |
|--------|---------------|-----------------------------------------------------|--------------------------|----------------------------|
| `md`   | Markdown      | No                                                  | HTML                     | No                         |
| `md+`  | Markdown Plus | Yes                                                 | [XHTML](#xhtml-markdown) | No                         |
| `mdx`  | Mardown Jsx   | Yes                                                 | [XHTML](#xhtml-markdown) | Yes, without import/export |

### XHTML Markdown

Because the `md+` and `mdx` format supports [content component](content-component.md) like `<Foo />`

* All element should be closed. `<br>` is not valid `<br/>` is
* The standard URL bracket syntax `<http://www.example.com>` is not valid
* No Markdown indented code or indented list, you need to use xhtml element

## Remark and Rehype Plugins

All format applies the [remark and rehype plugins](remark-rehype-unified.md)