---
title: Outline
description: The outline is the structure of the document represented by the `headings.
---

The outline is the structure of the document represented by the `headings`.

It helps:
* creating the [Table of Content](#table-of-content)
* and [styling the content heading and table of content entries](#numbering-style)

## Table of Content

The derived table of content is printed by the [TOC component](../components/toc.md)
when the chosen [layout](../reference/layout.md) includes it.

## Numbering Style

You can define the outline numbering behavior in the `outline` section of the [configuration file](conf.md)

The numbering is applied:

* on the headings (`h1` to `h6`)
* and on the [Table of Content (Toc)](../components/toc.md)

| Name               | Default   | Desc                               |                               
|--------------------|-----------|------------------------------------|
| enabled            | `true`    | Is outline numbering enabled       |
| suffix             | ` - `     | The suffix of the numbering        |
| counterSeparator   | `.`       | The separator between each counter |
| counterStyleLevel2 | `decimal` | The style of the level 2 counter   | 
| counterStyleLevel3 | `decimal` | The style of the level 3 counter   | 
| counterStyleLevel4 | `decimal` | The style of the level 4 counter   | 
| counterStyleLevel5 | `decimal` | The style of the level 5 counter   | 
| counterStyleLevel6 | `decimal` | The style of the level 6 counter   | 