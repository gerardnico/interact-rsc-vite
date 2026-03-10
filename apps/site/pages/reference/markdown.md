---
title: Markdown Page
---

We support 2 Markdown formats:

* [Markdown](#markdown)
* [Mdx](#mdx)

## Format

### Markdown

Markdown file are [pages](page.md) that accepts:

* the Markdown syntax
* and [content component](component.md#type) like `<Foo />`

### Mdx

Mdx pages are [Markdown page](#markdown) that accepts also JavaScript expressions such as:

* ESM `imports/exports`
* And JS expression `{foo}`

Example:

```mdx
export function Thing() {
  return <>World</>
}

# Hello <Thing />
```

## How to create your own content component

See [How to add a Markdown component](../howto/add-a-content-component.md)
