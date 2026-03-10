---
layout: holy
title: Favicons generation
---

Favicons may be generated from a master svg file with the
command [generate-favicons](https://github.com/gerardnico/interact-astro/blob/main/packages/interact/src/cli/commands/generate-favicon.ts)
They are added automatically in the favicon set if the generated set is found on the file system
in the `public` directory.

List of generated files:

* favicon.ico
* favicon-96x96.png
* favicon.svg
* apple-touch-icon.png
