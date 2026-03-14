---
title: Mdx pages
---

`Mdx` pages are [module page](page-module.md) that accepts the [mdx](#syntax)

## Example

```mdxjs
export function Thing() {
    return <>World</>
}

#
Hello < Thing / >
```

## Syntax

It's a syntax above [Markdown page](markdown.md) that accepts also JavaScript expressions such as:

* ESM `imports/exports`
* And JS expression `{foo}`

The full syntax can be found on the [mdx website](https://mdxjs.com/table-of-components/)

## Features

`mdx` pages:
* are part of the final bundle
* apply the [remark and rehype plugins](remark-rehype-unified.md)
