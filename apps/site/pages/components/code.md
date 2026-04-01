---
title: Code component
---

`Code` is 
* a [content component](../reference/component.md) 
* based on [prismJs](https://prismjs.com/) 
* that highlights the syntax of the text that it wraps.

## Usage

### Markdown

You can use it in a [markdown page](../reference/markdown.md)
with [Markdown fence](https://spec.commonmark.org/0.31.2/#fenced-code-blocks)

````markdown
```js
let counter = 1 + 1
```
````

yield:

```js
let counter = 1 + 1
```

### Programmatic Page

You can also [install it](../reference/registry.md) or use it directly in a [programmatic page](../reference/page-module.md)

```jsx
import Code from "@combostrap/interact/component/Code";

export default function myPage() {
    return (
        <Code lang="markdown">
            **Markdown** text
        </Code>
    )
}
```

yield:

```markdown
**Markdown** text
```


## Registration

The code component is [registered](../howto/add-a-markdown-component.md#register-it) to the `pre` html element.

Therefore, it will pretty print the code enclosed by `<pre>` element and [Markdown fence](#markdown).