---
title: Table of Content
---

`Toc` is a [partial component](../reference/component.md#type) that prints the [page outline](../reference/outline.md)
in a table of content.

It's printed only if the [layout](../reference/layout.md) includes it.


## Maximal Level

You can set the maximum level printed in the components section of the [configuration file](../reference/conf.md)

```json
{
  "components": {
    "Toc": {
      "props": {
        "maxDepth": 3
      }
    }
  }
}
```

## Numbering

The numbering follows the [outline configuration](../reference/outline.md#numbering-style).