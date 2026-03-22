---
title: How to build the Interact website
---

## Favicons

If you want to generate the [favicon](favicons.md) from the master svg file at built time,
you need to add it in the build script.

Example:

```json
{
  "scripts": {
    "build": "interact favicon && interact build"
  }
}
```