---
title: Typescript
---

## tsconfig.json

Module resolution should be bundler so that no extension is required in import path (By default, shadcn component import do not have
any extension)

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "ESNext"
  }
}
```
