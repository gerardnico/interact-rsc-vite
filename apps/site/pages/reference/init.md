---
name: Init
---

## Init

* Create a [conf file](conf.md)
* Create a [directory layout](directory-layout.md)
* Create a [gitignore and gitattributes](git.md)
* Add the minimal [global style](styling.md#global-css-file) so that CSS class from pages and components are taken

* Optionally, for programmatic page
  * Add a `tsconfig.json`
  * Add a `package.json`

```json
{
  "name": "project-name",
  "type": "module",
  "version": "0.0.1",
  "dependencies": {
    "@combostrap/interact": "0.1.0"
  },
  "scripts": {
    "start": "interact start",
    "build": "interact build",
    "schema": "interact schema"
  }
}
```

## First Steps

* Add a `favicon.svg` file into the [image directory](directory-layout.md) (by default `src/images`) 