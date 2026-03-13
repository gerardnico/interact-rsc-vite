---
title: How to create a module page (Jsx, Tsx, Js, Mdx)?
---

A `module page` is a [page](page.md) created from a `Jsx`, `Tsx`, `Js`, `Mdx` file.

## Example

### Jsx

```jsx
// pages/my-page.jsx
export const frontmatter = {
    layout: "landing"
}

export default function MyPage() {
    return (
        <p>You can create a `jsx` page</p>
    )
}
```

### Typescript tsx

```tsx
// pages/my-page.tsx
import type {InteractFrontmatter} from "@combostrap/interact/client";

export const frontmatter: InteractFrontmatter = {
    layout: "landing"
}

export default function MyPage() {
    return (
        <p>You can create a `tsx` page</p>
    )
}
```

## Properties

They:

* allows `import` and `export`
* are added to the final bundle
