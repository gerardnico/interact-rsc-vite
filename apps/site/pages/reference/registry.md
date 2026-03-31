---
title: Components Registry, our components
---


Our [layouts](layout.md) are built on top of components that are reusable
via a [ShadCn Registry](https://ui.shadcn.com/docs/registry)

## Steps

### Add the interact registry

Add it into your [components.json](https://ui.shadcn.com/docs/components-json#registries)

```json
{
  "registries": {
    "@interact": "https://interact.combostrap.com/r/{name}.json"
  }
}
```

### Discover the components

* Check our [registry index file](https://interact.combostrap.com/r/registry.json)
* or list or search them via the cli

```bash
yarn dlx shadcn@latest list @interact
yarn dlx shadcn@latest search @interact -q mode
```

### Install a component using the cli

```bash
yarn dlx shadcn@latest add https://interact.combostrap.com/r/ModeToggle.json
yarn dlx shadcn@latest add @interact/ModeToggle
```