---
title: Styling
---

This page is about the options that you have to style your project.

On a high level, we use [Tailwind](https://tailwindcss.com/) with
the [shadcn convention](https://ui.shadcn.com/docs/theming).

## Options List

### Tailwind

We use [tailwind](https://tailwindcss.com/) as styling system.

So you can:

* apply any [Tailwind class](https://tailwindcss.com/docs/styling-with-utility-classes)
* configure it and add [custom styles](https://tailwindcss.com/docs/adding-custom-styles) in
  the [global CSS file](#global-css-file)

### Global CSS File

The global CSS file path is by default `src/styling/global.css` from the [root path](directory-layout.md) (You
can [change it](#configuration)).

If the file does not exist, we apply
a [default one](https://github.com/combostrap/interact/tree/main/src/interact/styling/global.css).

We follow the [shadcn convention with CSS Variable](https://ui.shadcn.com/docs/theming).

Note that if you create your own global CSS file, you also need
to [register as source](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources):

* the `interact components`
* and your [pages directory](directory-layout.md)

Example:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@source "../node_modules/@combostrap/interact/src/interact/components";
@source "./src/pages";
```

### CSS Variables

The `CSS variables` are known as `token` and are present in the [global CSS file](#global-css-file).

The standard `Shadcn` variables are listed [here](https://ui.shadcn.com/docs/theming#theme-tokens).

You can also [add your own CSS variables](../howto/add-new-css-variables.md)

### Outline Numbering

We support [heading numbering styling](outline.md#numbering-style).

### Apply styles Object

Instead of TailWind class, you can always apply style directly

```tsx
const styles: Record<string, React.CSSProperties> = {
    buttons: {
        margin: ".25rem .125rem"
    }
}
return (
    <button style={styles.button}></button>
)
```

## How to add CSS Variables and Classes

In this [tutorial](../howto/add-new-css-variables.md), we explain how to define CSS variables, create new TailWind
Classes and use them.

## Configuration

### Location of the Global Css file

You can change the location of the [global CSS file](#global-css-file) in the `paths.css` property of
the [configuration file](conf.md).

### Dark/Light mode

Dark/Light mode is handled by adding or removing the `dark` class
to the HTML element.

Code fragment from the default `ModeToggle` button.

```tsx
const [theme, setThemeState] = React.useState<
    "theme-light" | "dark" | "system"
>("theme-light")

React.useEffect(() => {
    const isDark =
        theme === "dark" ||
        (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList[isDark ? "add" : "remove"]("dark")
}, [theme])
```

The full example can be seen in the [shadcn Astro documentation](https://ui.shadcn.com/docs/dark-mode/astro)
