---
title: How to add a layout?
---

## Steps

### Create a layout component

The layout should return the `html` element wrapping a [page component](../page.md)

Example of minimal implementations:

```tsx
import type {TemplateProps} from "@combostrap/interact/client";

export function MyLayout(props: TemplateProps) {
    const PageComponent = layoutProps.pageModule.default;
    return (
        <html lang="en" dir="ltr">
        <Head {...templateProps}/>
        <body>
        {PageComponent && <PageComponent request={layoutProps.request}/>}
        </body>
        </html>
    )
}
```

### Register it

You can register it by defining it in the [configuration file](../conf.md).

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

You can now use it.

For instance, in a [markdown page](../markdown.md)

```markdown
---
layout: my-layout
---
```