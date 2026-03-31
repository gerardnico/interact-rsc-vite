---
title: Layout
description: A layout is the top component that wraps a page to render a full HTML page.
---

A `layout` is the top [component](component.md) that wraps a [page](page.md) to render a full HTML page.

It's also known as the `root` component because it returns the entire document including the root `<html>` tag.

## Built-in List

* Holy - Full layout
* HolyMedium - Holy layout without the sidebar
* Hamburger - header, content and footer
* Landing - Hamburger layout where the content is not constrained
* None: No layout applied, your page should return the `html` root element

## How to set a layout

You can set the layout by giving its name in the layout [frontmatter property](frontmatter.md)

Example:

* for a [markdown page](markdown.md)

```markdown
---
layout: holy
---
```

* for a [programmatic page](page-module.md)

```javascript
export const frontmatter = {
    layout: 'holy'
}
```

## How to create a layout

See [How to create a layout](../howto/add-a-layout.md)

## Not a Client Component Restriction

Layout and partial component cannot be [client component](../reference/rsc.md#use-client)
otherwise you get the [fatal rsc error](../reference/rsc.md#only-plain-objects-error)

## Partials

Default layouts are composed of the following partials:

* Html - the html tag
* Head - the head tag
* Body - the body tag
* Header - the page header
* Aside - the sidebar
* Toc - the toc
* Footer - the page footer

If you want to override the default ones, you should create a partial with the same name and store it at:
`@/components/partials`.

They:

* are and should be [server component](rsc.md)
* accepts the context props (page and request)
