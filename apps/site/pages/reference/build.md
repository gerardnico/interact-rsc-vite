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

## Static Server Generation

On static server generation, an alternate markdown version
is also generated for [AI agent consumption](ai.md#markdown-format-for-all-pages).

## base option when not deploying at the root path

When deploying, you may host your site:

* not on the root path of the domain (ie https://username.github.io)
* but on a sub-path (ie https://username.github.io/project-name)

This subpath (here `/project-name`) is known as the `base` in the `site.base` [configuration file](conf.md).

If you don't deploy at the root path, you need to set it so that the paths to resources such as image, CSS file
are changed accordingly.

