---
title: At Alias
---

The design system [shadcn](shadcn) uses by default the `@` alias to represent
the `src` directory. We support it.

## Example

In a import such as:

```javascript
import {Button} from "@/components/ui/button"
```

the real path would be `src/components/ui/button`

## Configuration

### Configuration file

By default, it's mapped to `src` but you can change it in the
`alias.atDirectory` [configuration](conf.md)

### Typescript and IDE

For [TypeScript](typescript.md) support (and therefore IDE), you should configure the alias in your `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  }
}
```
