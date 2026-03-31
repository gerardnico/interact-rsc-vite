---
title: How to build your project website?
---

## Favicons and App Manifest

If you want to generate the [favicons and app manifest](favicons.md) at built time,
you need to add it in the build script.

Example:

```json
{
  "scripts": {
    "build": "interact favicon && interact build"
  }
}
```