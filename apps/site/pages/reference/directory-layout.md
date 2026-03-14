---
title: Directory Layout
---


A typical interact project is composed of the following paths:

* `interact.config.json`: the [configuration file](conf.md)
* `pages`: a directory that contains [pages](page.md)
* `images`: a directory that contains [raster image](../components/image.md) or [Svg](../components/svg.md)
* `public`: a directory that contains other resources such as `pdf` that your pages may reference.
* `components`: a directory that contains your custom [components](../reference/component.md#custom)
* `config`: a directory that contains extra configuration such as the [markdown config](remark-rehype-unified.md#config) 

They are all relative to the `root` directory which is the directory of your project.

## Configuration

The root directory is defined in order of precedence as being:

* the directory of the `confPath` [cli flag](cli.md)
* the `INTERACT_CONF_PATH` environment variable if defined
* the current directory as default

You may configure the other paths in the `paths` node of the [configuration file](conf.md)
