# Overview

## Environment

This project is built on top of React Server Component.

We have 3 parts:

* all code in src/interact is the Interact cli and is compiled by TypeScript
* all code in `src/lib` is:
  * bundled by vite
  * or any resources (css, image, ...) used by the src/interact cli code
* and the types

Why 2 resolution? Because with the shadcn registry, the path should not have any extension (ie bundler)  