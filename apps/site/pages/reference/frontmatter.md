---
title: FrontMatter
---

## Example

### Markdown Page (md, mdx)

In a [markdown Page](markdown.md)

```markdown
---
title: My title
layout: holy
---
```

### Programmatic Page (tsx, jsx or js)

In a [programmatic page](page-module.md)

```ts
export const frontmatter = {
    title: "My page title",
    layout: "holy"
}
```