# Typescript

## type vite/client

https://vite.dev/guide/features#client-types

## module resolution

```json
{
  "moduleResolution": "NodeNext",
  "module": "NodeNext"
}
```

All files should have a `js` even the TypeScript one.

Why ?

To avoid:

```html
message: Cannot find module '/interact-rsc-vite/src/interact/config/jsonConfigSchema' imported from /interact-rsc-vite/src/interact/cli/commands/schema.ts
```

## Source map

So that the stack trace line number are not the compiled one.

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "declarationMap": true
  }
}
```

## Declaration map (d.ts) file

To help IDE find the right code place.

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```

## Debug

For any debug, set the `"skipLibCheck": false` temporarily
