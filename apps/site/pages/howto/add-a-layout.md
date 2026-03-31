---
title: How to create a layout?
---

## Steps

### Create a layout component

The layout should return the `html` element wrapping a [page component](../reference/page.md)

Example of minimal implementations:

```tsx
import type {ContextProps} from "@combostrap/interact/types";
import Head from "@combostrap/interact/components/partials/Head";
import Html from "@combostrap/interact/components/partials/Html";
import Body from "@combostrap/interact/components/partials/Body";

export function MyLayout(props: ContextProps) {
    const PageComponent = layoutProps.page.default;
    const request = layoutProps.request;
    return (
        <Html {...contextProps}>
            <Head {...contextProps} />
            <Body {...contextProps}>
                {PageComponent && <PageComponent request={request}/>}
            </Body>
        </Html>
    )
}
```

### Register it

Interact expects all layout files to be stored in the directory `@/components/layouts` as `jsx` or `tsx` files

Store the previous layout at : `@/components/layouts/myLayout.tsx`

### Reuse a layout

If you want to make a small changes, the easiest is to copy the actual interact layout.
They are all under the [layouts components directory](https://github.com/combostrap/interact/tree/main/src/interact/components)

### Use it

You can now use it by referencing it in your [frontmatter](../reference/frontmatter.md)

For instance, in a [markdown page](../reference/markdown.md)

```markdown
---
layout: my-layout
---
```