## type vite/client

https://vite.dev/guide/features#client-types

## module resolution

```json
{
  "moduleResolution": "NodeNext",
  "module": "NodeNext"
}
```

All files should have a `js` even the typescript one.

Why ?

To avoid:

```html
message: Cannot find module '/interact-rsc-vite/src/interact/config/jsonConfigSchema' imported from /interact-rsc-vite/src/interact/cli/commands/generate-schema.ts
```

