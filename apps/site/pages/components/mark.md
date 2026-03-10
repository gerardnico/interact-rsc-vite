---
title: Mark element (Highlighted text)
---

The `Mark` component represents a `highlighted` text.

## Usage in a Markdown page

In a [markdown page](../reference/markdown.md), you create a mark with a `backtick string`

Example:
```markdown
`This is a mark`
```

will output: `This is a mark`

## Styling

There are 2 [css variables](../reference/style.md#css-variables):

* `highlight-bg` for the background
* `highlight-color` for the color

## Registration

It's used by default to hack the [Markdown backtick code span](https://spec.commonmark.org/0.31.2/#code-spans)
into a mark element instead of a code one.

This component was [mapped](../howto/add-a-content-component.md#register-it) to the `code` element
in the components section of the [configuration file](../reference/conf.md)

```json
{
  "components": {
    "code": {
      "importPath": "@combostrap/interact/components/Mark",
      "type": "content"
    }
  }
}
```