---
title: Styling
---

## CSS Variables

You can set styling configuration via CSS Variables.

The `css variables` can be set in the style section of the [configuration file](conf.md).

Example:

```json
{
  "style": {
    "cssVariables": {
      "danger": "#dc3545"
    }
  }
}
```

The full list can be seen [here](https://getbootstrap.com/docs/5.3/customize/css-variables/).

You don't need to set `rgb` color, we do it automatically.

Note that some color variable requires 2 colors for the `dark` and `light` mode.