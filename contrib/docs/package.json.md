## Sharp

Sharp is also in: `@realfavicongenerator/image-adapter-node`.
We pinned it with resolutions.

## ts-node

`ts-node` is mandatory when working with `oclif` has command library
for the [dev](../../src/interact/cli/dev.js) script

## Component Export

The exports are meant to be used/bundled by vite, so they live in `src`

```json
{
  "exports": {
    "./components/*": "./src/interact/components/*.tsx"
  }
}
```

Components Export are not the compiled (dist) one, they are compiled by Vite so that the
import of CSS file works.
The only code that needs to be build is the code called by the cli to start vite
(ie all middleware and plugins) located in `src/interact`

## Vite

As direct dependency, it is mandatory for development otherwise you get error such
unable to find `./cjs/react-server-dom-webpack-client.browser.development.js`

After upgrading test a ssg
(tested vite 8.0.1 and it was breaking)


## DevDependencies

They include all dependencies to compile with tsc.
so that we can download the GitHub tarball, install only the devDependencies
and compile.

## Files

We need:

* all compiled js files in dist because the cli needs them.
* the src lib file so that vite will load them
* the type

```json
{
  "files": [
    "dist/interact/**/*",
    "src/lib/**/*",
    "src/types/**/*"
  ]
}
```

otherwise we get this kind of error, when starting the cli:

```
message: [MODULE_NOT_FOUND] import() failed to load client-project/node_modules/@combostrap/interact/dist/interact/cli/commands/start.js: Cannot find module 'client-project/node_modules/@combostrap/interact/dist/interact/pages/viteVirtualPagesModules.js' imported from client-project/node_modules/@combostrap/interact/dist/interact/cli/shared/vite.config.js
```

## Typescript - tsx

`tsx` is used to run `ts` file. `yarn build` script is a good example.

## Styling, tailwind and Shadcn

* tw-animate-css
* shadcn
* class-variance-authority
* tailwind-merge

