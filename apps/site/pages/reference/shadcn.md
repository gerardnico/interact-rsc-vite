---
title: Shadcn Support
---

You can use [shadcn](https://ui.shadcn.com/) to discover and add components based

## Base UI / Radix-UI Interactivity Library

Our [own default components](registry.md) are developed on top of [base-ui](interactive-component.md#base-ui-library), the next generation of Radix-ui.

If you want only Radix-UI, you need to:

* build your own [layouts](layout.md) without any base-ui component (mostly navbar and sidebar)
* or
  * use Radix-Ui components in your project at `@/components/ui`
  * set the `layout.uiAliasResolution` [configuration](conf.md) to `cascade`.

With `cascade` as resolution, the UI import such as `import {Button} from "@/components/ui/button.js"` will
be resolved first against your project.  
