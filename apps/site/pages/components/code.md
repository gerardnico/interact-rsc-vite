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

&#96;&#96;&#96;js<br/>
let counter = 1 + 1<br/>
&#96;&#96;&#96;<br/>

yield:

```js
let counter = 1 + 1
```

### Programmatic Page

You can also use it directly in a [programmatic page](../reference/page-module.md)

```jsx
import Code from "interact:components";

export default function myPage() {
    return (
        <Code lang="markdown">
            **Markdown** text
        </Code>
    )
}
```

yield:

<Code lang="markdown">
**Markdown** text
</Code>

## Registration

The code component is [registered](../howto/add-a-content-component.md#register-it) to the `pre` html element.

Therefore, it will pretty print the code enclosed by `<pre>` element and [Markdown fence](#markdown).