---
layout: holy
title: Favicons and Site Manifest generation
---

Favicons and Site Manifest may be generated:

* automatically from the [cli with the favicons command](cli.md).
* manually from the [website](https://realfavicongenerator.net/)

## Conf

The [following configurations](conf.md) are used

| Conf                 | Manifest Property | Description                                                                                |
|----------------------|-------------------|--------------------------------------------------------------------------------------------|
| `site.faviconMaster` | `icons`           | The SVG file name in the [image directory](directory-layout.md) (default to `favicon.svg`) |
| `site.name`          | `shortName`       | The site name                                                                              |
| `site.title`         | `name`            | The site long name (description)                                                           |
| `site.colorPrimary`  | `themeColor`      | The primary color                                                                          |
| `site.base`          |                   | base path added to the Icons path                                                          |

## List of generated files

* `favicon.ico`
* `favicon-96x96.png`
* `favicon.svg`
* `apple-touch-icon.png`
* `web-app-manifest-512x512.png` for the manifest
* `web-app-manifest-192x192.png` for the manifest
* [site.webmanifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)

Note that if these files are found on the file system
in the [public directory](directory-layout.md), they are automatically used.

## GitIgnore

If you generate them automatically, you may want to put them in `.gitignore`

```gitignore
public/favicon.svg
public/favicon-96x96.png
public/favicon.ico
public/apple-touch-icon.png
public/web-app-manifest-192x192.png
public/web-app-manifest-512x512.png
public/site.webmanifest
```