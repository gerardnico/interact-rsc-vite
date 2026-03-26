# Styling

This page is about the options that you have to style your project.

On a high level, we use [tailwind](https://tailwindcss.com/) with
the [shadcn convention](https://ui.shadcn.com/docs/theming).

## List

### Tailwind

We use [tailwind](https://tailwindcss.com/) as styling system.

So you can:

* apply any [Tailwind class](https://tailwindcss.com/docs/styling-with-utility-classes)
* configure it and add [custom styles](https://tailwindcss.com/docs/adding-custom-styles) in
  the [global CSS file](#global-css-file)

### Global CSS File

The global CSS file path is by default `src/styling/global.css` from the [root path](directory-layout.md)

You can change it in the [paths.cssFile property of the configuration file](conf.md).

If the file does not exist, we apply
a [default one](https://github.com/combostrap/interact/tree/main/src/interact/styling/global.css).

We follow the [shadcn convention with CSS Variable](https://ui.shadcn.com/docs/theming).

Note that in your own global CSS file, you also need
to [register interact as source](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources)

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@source "../node_modules/@combostrap/interact";

```

### Outline Numbering

We also support [heading numbering styling](outline.md#numbering)

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