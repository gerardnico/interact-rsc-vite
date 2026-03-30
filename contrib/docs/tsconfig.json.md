# Typescript

## tsconfig.json location and naming

They are not at the root and called `tsconfig.cli.json` or `tsconfig.lib.json`
because it's not supported by IntelliJ.

## type vite/client

https://vite.dev/guide/features#client-types

## cli module resolution

We don't have the [module resolution](../../src/interact/tsconfig.json) set to `bundler` because
we don't bundle the cli as vite does. We just emit js file with TypeScript.

```json
{
  "moduleResolution": "NodeNext",
  "module": "NodeNext"
}
```

The constraint is that in this project all files should have a `js` even the TypeScript one.
(Note that the users of interact have not this constraint)

Why ? Note: Without bundler, we would get this error:

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
