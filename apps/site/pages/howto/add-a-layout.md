---
title: How to create a layout?
---

## Steps

### Create a layout component

The layout should return the `html` element wrapping a [page component](../reference/page.md)

Example of minimal implementations:

```tsx
import type {TemplateProps} from "@combostrap/interact/client";
import Head from "@combostrap/interact/components/Head";

export function MyLayout(props: TemplateProps) {
    const PageComponent = layoutProps.page.default;
    const request = layoutProps.request;
    return (
        <html lang="en" dir="ltr">
        <Head {...layoutProps} />
        <body>
        {PageComponent && <PageComponent request={request}/>}
        </body>
        </html>
    )
}
```

### Reuse a layout

If you want to make a small changes, the easiest is to copy the actual interact layout.
They are all under the [components directory](https://github.com/combostrap/interact/tree/main/src/interact/components)


### Register it

You can register it by defining it in the [configuration file](../reference/conf.md).

```json
{
  "components": {
    "MyLayout": {
      "importPath": "src/component/MyLayout.js",
      "type": "layout"
    }
  }
}
```

### Use it

You can now use it by referencing it in your [frontmatter](../reference/frontmatter.md)

For instance, in a [markdown page](../reference/markdown.md)

```markdown
---
layout: my-layout
---
```