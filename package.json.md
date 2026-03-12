## Sharp

Sharp is also in: `@realfavicongenerator/image-adapter-node`.
We pinned it with resolutions.

## ts-node

`ts-node` is mandatory when working with `oclif` has command library
for the [dev](src/interact/cli/dev.js) script

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