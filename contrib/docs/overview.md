# Overview

## Environment

This project is built on top of React Server Component.

A server component environment is special because it needs to run:

* in the browser
* and in the server

Therefore, there is not 2 projects, there is only one. 

Trying to split client code and the code vite bundle is futile because
most of the components are imported in the client code.
