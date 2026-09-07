---
title: How to create a layout?
---

This page shows you how to create your own [layout](../reference/layout.md)
so that you can define it in your [pages](../reference/page.md)

## Steps

### Create a layout component

A layout is a component that:

* returns the root `html` element
* and wraps a [page component](../reference/page.md)

Example of minimal implementation:

```tsx
import type {LayoutProps} from "@combostrap/interact/types";
import Head from "@combostrap/interact/components/partials/Head";
import Html from "@combostrap/interact/components/partials/Html";
import Body from "@combostrap/interact/components/partials/Body";

export function MinimalLayout(layoutProps: LayoutProps) {
    return (
        <Html {...layoutProps}>
            <Head {...layoutProps} />
            <Body {...layoutProps}>
                <main className={layoutProps.context.meta.isProsePage ? "prose" : ""}>
                    {layoutProps.page.contentElement}
                </main>
            </Body>
        </Html>
    )
}
```

The `prose` class adds supports for [styling prose content](../reference/styling.md#prose-content)

### Register it

Interact expects all custom layouts files to be stored in the [layouts directory](../reference/directory-layout.md) (
default to `src/components/layouts`)
as `jsx` or `tsx` files

Save your layout at: `src/components/layouts/MinimalLayout.tsx`

## Verify that your head component was successfully registered

You can see the registered component with the [interact config command](../reference/conf.md#cli)
```bash
interact config -f components # list all components
interact config -f components.MinimalLayout # list only your layout
interact config -f components | yq 'to_entries | map(select(.value.type == "layout")) | from_entries' # list all layout with yq
```

### Layout Name

The file name normalized is the key.

In our case, the layout name is `MinimalLayout`

Because we normalize the layout key, you can use casing in your file name and in the [layout meta](#use-it):

* `MinimalLayout`: camel case
* `minimal_layout`: snake case
* `minimal-layout`: kebab-case

### Reuse a layout

If you want to make a small changes, the easiest way is to copy the actual interact layout.
They are all under
the [layouts components directory (./src/resources/components/layouts)](https://github.com/combostrap/interact/tree/main/packages/interact/src/resources/components/layouts)

### Use it

You can now use it by referencing it in your [frontmatter](../reference/frontmatter.md)

For instance, in a [markdown page](../reference/markdown.md)

```markdown
---
layout: minimal-layout
---
```