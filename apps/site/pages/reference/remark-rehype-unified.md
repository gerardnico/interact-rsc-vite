---
title: Remark and Rehype Unified Plugins
---


[Remark](https://unifiedjs.com/explore/keyword/remark/) and [Rehype](https://unifiedjs.com/explore/keyword/rehype/) are
plugins that adds features to

* [markdown](markdown.md)
* and [mdx pages](mdx.md)

They transform how the document are parsed and may add attribute, create component and more.

## List

### Base Built-in

The following plugins are always applied:

* Remark:
  * [remark-parse](https://unifiedjs.com/explore/package/remark-parse/) for parsing Markdown
  * [remark-frontmatter](https://unifiedjs.com/explore/package/remark-frontmatter/) for [Frontmatter](frontmatter.md)
    extraction
  * `remark-local-link-checker`: Local Link checker to page and assets only in dev mode.
  * [remark-rehype](https://unifiedjs.com/explore/package/remark-rehype/) to support rehype

* Rehype:
  * [rehype-slug](https://unifiedjs.com/explore/package/rehype-slug/)
    and [rehype-extract-toc](https://github.com/stefanprobst/rehype-extract-toc) for the [outline](outline.md)
  * `rehype-href-rewrite`: IDE supports so that you can use the full path:
    * for a page. Example: `my-page.mdx` is rewritten to `my-page`
    * for a static asset in the [public directory](public.md)

### Default

By default, we apply the [Remark Gfm](https://github.com/remarkjs/remark-gfm) to add the
[GitHub Syntax](https://github.github.com/gfm/)

You can overwrite and set your own by applying a [different configuration](#config)

## Config

Above the [mandatory plugin](#base-built-in), you can define your
own [unified plugins](https://unifiedjs.com/learn/guide/using-unified/#plugins)

Example of configuration module with the actual config applied:

```typescript
// ./config/markdown.config.ts
import remarkGfm from "remark-gfm";
import type {InteractMarkdownConfigType} from "@combostrap/interact/types";

export const markdownConfig: InteractMarkdownConfigType = {
    remarkPlugins: [
        remarkGfm // Table
        // [ otherPlugin, props ] // example on how to pass props
    ],
    rehypePlugins: []
}
export default markdownConfig;
```

> ![Important]
> Be sure to add the [remark-gfm](https://github.com/remarkjs/remark-gfm) plugin back in the list of remark plugins if
> you want it to be applied.


To define the location of the configuration file, you can:

* create the config file `config/markdown.config.ts` or `config/markdown.config.js` from
  the [root](directory-layout.md)
* or set the value in the `markdown.configImportPath` of the [configuration file](conf.md). If the value starts with a
  `.`, it's considered a path from the [root directory](directory-layout.md) otherwise, it's considered a module name to
  be searched from `nodes_modules`