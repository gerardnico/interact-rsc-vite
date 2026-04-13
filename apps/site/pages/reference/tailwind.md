---
title: Tailwind
---


We use [tailwind](https://tailwindcss.com/) as styling system.

So you can:

* apply any [Tailwind class](https://tailwindcss.com/docs/styling-with-utility-classes)
* configure it and add [custom styles](https://tailwindcss.com/docs/adding-custom-styles) in
  the [global CSS file](#global-css-file)

## Global CSS File

The [global CSS file](styling.md#global-css-file) is the tailwind entry point.

### Default

The default global CSS file import:

* tailwind source (ie)

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

* and our utilities classes:
  * for the [grid system](../components/grid.md)
  * `icon`
* and default publishing style for headings, list, ...

We follow the [shadcn convention with CSS Variable](https://ui.shadcn.com/docs/theming).

### Custom

A custom default minimal implementation of the [global CSS file](styling.md#global-css-file) would

* import the [default interact configuration](#default)
* and add
  * the custom `components` directory
  * and the [pages directory](directory-layout.md)

Example:

```css
/* Interact default import */
@import "@combostrap/interact/global.css";

/* Your Pages if you use tailwind class in them */
@source "../pages";
/* Components */
@source "../components";
```

where the `@source` directive is
a [tailwind directive](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources)
that add to directory to the scanner.
