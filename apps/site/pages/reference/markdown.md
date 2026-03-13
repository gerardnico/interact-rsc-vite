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

Note that because we allow custom elements:

* All element should be closed
* The standard URL `<http://www.example.com>` is not valid

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

## Plugins

### Base Built-in

The following plugins are always applied:

* Remark:
  * [remark-parse](https://unifiedjs.com/explore/package/remark-parse/) for parsing Markdown
  * [remark-frontmatter](https://unifiedjs.com/explore/package/remark-frontmatter/) for [Frontmatter](frontmatter.md)
    extraction
  * `remark-local-link-checker`: Markdown link checker to page and assets only in dev mode.
  * [remark-rehype](https://unifiedjs.com/explore/package/remark-rehype/) to support rehype

* Rehype:
  * [rehype-slug](https://unifiedjs.com/explore/package/rehype-slug/)
    and [rehype-extract-toc](https://github.com/stefanprobst/rehype-extract-toc) for the [outline](outline.md)
  * `rehype-href-rewrite`: IDE supports so that you can use the full path:
    * for a page. Example: `my-page.mdx` is rewritten to `my-page`
    * for a static asset in the [public directory](public.md)

### Config

Above the [mandatory plugin](#base-built-in), you can define your
own [unified plugins](https://unifiedjs.com/learn/guide/using-unified/#plugins)

Example of configuration module with the actual config applied:

```typescript
// ./config/markdown.config.ts
import remarkGfm from "remark-gfm";
import type {InteractMarkdownConfigType} from "@interact/markdown-config";

export const markdownConfig: InteractMarkdownConfigType = {
    remarkPlugins: [
        remarkGfm // Table
        // [ otherPlugin, props ] // example on how to pass props
    ],
    rehypePlugins: []
}
export default markdownConfig;
```

where:

* `remarkPlugins` are [remarkPlugins](https://unifiedjs.com/explore/keyword/remark/)
* `rehypePlugins` are [rehypePlugins](https://unifiedjs.com/explore/keyword/rehype/)

> ![Important]
> Be sure to add the [remark-gfm](https://github.com/remarkjs/remark-gfm) plugin back in the list of remark plugins if
> you
> want it to be applied.


To define the location of the configuration file, you can:

* create the config file `config/markdown.config.ts` or `config/markdown.config.js` from
  the [root](directory-layout.md)
* or set the value in the `markdown.configImportPath` of the [configuration file](conf.md). If the value starts with a
  `.`, it's considered a path from the [root directory](directory-layout.md) otherwise, it's considered a module name to
  be searched from `nodes_modules`