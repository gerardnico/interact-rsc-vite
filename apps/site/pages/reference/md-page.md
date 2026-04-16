---
title: Markdown Page
---


This page is about [pages](page.md) created with the [Markdown](markdown.md) extension (`.md`).

## Format

The content of a `md` file may be configured to be one of the 3 options below.
By default, we use the `mdr` format.

| Format | Description    | [Accepts Content component ?](markdown-component.md) | HTML format           | Javascript                 |
|--------|----------------|------------------------------------------------------|-----------------------|----------------------------|
| `md`   | Markdown       | No                                                   | HTML                  | No                         |
| `mdr`  | Markdown React | Yes                                                  | [XHTML](#xhtml-rules) | No                         |
| `mdx`  | Mardown Jsx    | Yes                                                  | [Mdx](#mdx-rules)     | Yes, without import/export |

### Mdr Rules

For the support of [markdown component](markdown-component.md) like `<Foo />`, the following rules applies:

* All elements should be closed. `<br>` is not valid `<br/>` is
* The standard URL bracket syntax `<http://www.example.com>` is not valid
* No Markdown indented code or indented list, you need to use xhtml element
* Block level tag should be alone on their own line. See [section below](#one-tag-block-level-element-on-one-line)

#### One tag block level element on one line

The parser does the distinction between inline (in a paragraph) and block element
based on the tag position

If the tag is on its own line, surrounded by blank lines or block-level content, it's a block otherwise
it's an inline tag.

For instance, these `th` HTML elements are incorrect. They are seen as being inline element

```html

<th>Head</th>
```

and results in a paragraph

```html

<p>
    <th>Head</th>
</p>
```

You need to write the tag in its own line. The correct way is:

```html

<th>
    Head
</th>
```

### Mdx Rules

`Mdx` follows the [mdr rules](#xhtml-rules) and the `style` prop expects a object of style properties, not a string.

For example:

* this is not correct `style="margin-right=2em;"`
* this is correct: `style={{marginRight: '2em'}}`

## Transform programmatically Markdown to React

We export 2 functions so that you can use as server Markdown processing programmatically:

| Name                      | Usage                                                                         | 
|---------------------------|-------------------------------------------------------------------------------|
| `markdownToPageSync`      | Transform a markdown Vfile (string or path) to a [page](../reference/page.md) |
| `markdownToComponentSync` | Transform a markdown Vfile (string or path) to a react component              |

Example:

```javascript
import {markdownToPageSync, markdownToComponentSync} from "@combostrap/interact/markdown";

let component = markdownToComponentSync("**Hello World**", {rootTagName: "span"});
let page = markdownToPageSync("## Hello World", {format: 'md'})
```

For a real examples, check the following [middlewares](middleware.md) source code:

* `local-markdown-pages.tsx` - local fetch
* `github-markdown.tsx` - remote fetch

These 2 transformations functions includes all [registered unifed plugins (remark and rehype)](remark-rehype-unified.md)

## Configuration

* The [default format](#format) may be set in the `markdown` node of the [configuration file](conf.md)
* The [configured remark and rehype plugins](remark-rehype-unified.md) are also applied.