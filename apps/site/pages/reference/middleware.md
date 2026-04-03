---
title: Middleware
---

A middleware is a module with a default function that:

* takes as input a context object with the [HTTP request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
* and returned:
  * a [Web Api HTTP Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
  * or a [page](page.md)

## Usage

* [CMS integration](cms.md) that returns a page
* Request Context enhancement such as adding a user via User Authentication

## Registration

You can register your middleware:

* automatically by storing it in the [middlewares directory](directory-layout.md) (`src/middlewares` by default)
* in the `middelwares` node of the [configuration file](conf.md)

Example:

```json
{
  "middlewares": [
    {
      "importPath": "./cms/my-cms-middleware.js",
      "props": {
        "uri": "",
        "timeout": 1
      }
    }
  ]
}
```

* They are executed in natural order.
* The import path may be relative to the [root directory](directory-layout.md)

## How to list the middlewares

You can check them with the [cli](cli.md)

```bash
interact config --filter="middlewares"
```

## Example: How to create a page middleware

See the [page provider cms integration](cms.md)

