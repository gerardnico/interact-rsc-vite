# Why our own Markdown processor?

We created our own processor because:

* the MdxJs rollup plugin:
  * transform hast into JavaScript (not react)
  * therefore the [Markdown syntax supported is not full](#the-markdown-comment-syntax-problem).
* it gives a easy way for cms plugin to support interactive component

## The Markdown comment syntax problem

To overcome the fact that the MdxJs rollup plugin
do not add custom element to Markdown, we set Markdown to be parsed as mdx.

Unfortunately, the comment syntax is not compatible, and we can't intercept for now, the document
[comment](https://github.com/orgs/mdx-js/discussions/2219)

ie Instead of

```markdown
<!-- Comment -->
```

you need to use

```mdxjs
{/* comment */ }
```

## Possible solutions checked

Note that we try to intercept, but we can't because they parse the document first as mdx before going through the remark
plugin
as seen:

* in the [architecture](https://mdxjs.com/packages/mdx/#architecture) doc.
* in the code, the mdx parsing is
  first: https://github.com/mdx-js/mdx/blob/af23c2d18b58467db567b7afe78d7492bb4ea4bc/packages/mdx/lib/core.js#L199
 



