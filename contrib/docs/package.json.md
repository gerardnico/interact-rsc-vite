## Sharp

Sharp is also in: `@realfavicongenerator/image-adapter-node`.
We pinned it with resolutions.

## ts-node

`ts-node` is mandatory when working with `oclif` has command library
for the [dev](../../src/interact/cli/dev.js) script

## Component Import

```json
{
  "imports": {
    "#components/*": "./src/interact/components/*/index.js"
  }
}
```

This import declaration permits to keep the component private
and to refer to them like that:

```javascript
import Code from "#components/Code"
```

It's used in the `interact:component-provider` module

## Component Export

```json
{
  "exports": {
    "./components/*": "./src/interact/components/*/index.js"
  }
}
```

Why not the `dist` directory? Because vite does the bundling.
The only code that needs to be build is the cli.

## Vite as direct dependency

Is mandatory for development otherwise you get error such
unable to find `./cjs/react-server-dom-webpack-client.browser.development.js`

## Prettier

Was added to get the type resolve `skipLibCheck` error:

```
node_modules/@svgr/core/dist/index.d.ts:1:25 - error TS2307: Cannot find module 'prettier' or its corresponding type declarations.

1 import { Options } from 'prettier';
                          ~~~~~~~~
```

## Files

We need:

* all compiled js files in dist because the cli needs them.
* the src file so that vite will load them

```json
{
  "files": [
    "dist/interact/**/*",
    "src/**/*"
  ]
}
```

otherwise we get this kind of error, when starting the cli:

```
message: [MODULE_NOT_FOUND] import() failed to load client-project/node_modules/@combostrap/interact/dist/interact/cli/commands/start.js: Cannot find module 'client-project/node_modules/@combostrap/interact/dist/interact/pages/viteVirtualPagesModules.js' imported from client-project/node_modules/@combostrap/interact/dist/interact/cli/shared/vite.config.js
```
