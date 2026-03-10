---
title: How to create a programmatic page (Jsx, Tsx, Js)?
---

A programmatic page is a [page](page.md) created in one of the following language: `Jsx`, `Tsx`, `Js`

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