---
title: How to add new CSS variables and generate Tailwind classes
---

This article will show you how to:

* define new [CSS Variables](../reference/styling.md#css-variables)
* define new classes in TailWind and use them

## Steps

To add new tokens in
the [global CSS file](../reference/styling.md#global-css-file), you need to,

* define them under `:root` and `.dark`,
* expose them to Tailwind with `@theme inline`.

### Naming convention and Contrast

In the Base/Radium UI / Tailwind's semantic token model, they use as suffix the term `foreground`.

This term means: `the content that sits on top of a background.`

For instance,

* `--highlight` is the background color of the element
* `--highlight-foreground` is the text/icon color rendered ON TOP of that background

The mental model is:

* `highlight` is a surface,
* and it's `foreground` is what you draw on that surface.

They are always defined as a pair to ensure a readable contrast between background and content.

### Add them in the global CSS file

Open the [global CSS file](../reference/styling.md#global-css-file) and define them under `:root` and `.dark`,

```css
:root {
    --highlight: oklch(0.862 0.097 75);
    --highlight-foreground: oklch(0.28 0.07 46);
}

.dark {
    --highlight: oklch(0.862 0.097 75);
    --highlight-foreground: oklch(0.99 0.02 95);
}
```

### Expose them to TailWind

```css
@theme inline {
    --color-highlight: var(--highlight);
    --color-highlight-foreground: var(--highlight-foreground);
}
```

### Use them

You can now use them:

```markdown
<mark class="bg-highlight text-highlight-foreground">My highlight</mark>
```

<mark class="bg-highlight text-highlight-foreground">My highlight</mark>
