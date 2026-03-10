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

## Support

### Comment

To overcome the fact that the MdxJs rollup plugin
do not add custom element, we set Markdown to be parsed as mdx.
Unfortunately, the comment syntax is not compatible, and we can't intercept for now, the document
[comment](https://github.com/orgs/mdx-js/discussions/2219)

Instead of

```markdown
<!-- Comment -->
```

you need to use

```mdxjs
{/* comment */
}
```

{/*
Note that we can't intercept it because they parse the document first as mdx before going through the remark plugin
as seen in the [architecture](https://mdxjs.com/packages/mdx/#architecture) doc.
*/}