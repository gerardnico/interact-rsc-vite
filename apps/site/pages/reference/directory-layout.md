---
title: Directory Layout
---

A typical interact project is composed of the following paths:

| Name                                         | Default Value             | Description                                                                                                  |
|----------------------------------------------|---------------------------|--------------------------------------------------------------------------------------------------------------|
| [@ alias](at-alias.md)                       | `src`                     | A directory that is mapped to the [@ alias](at-alias.md)                                                     |
| `config`                                     | `config`                  | a directory that contains extra configuration such as the [markdown config](remark-rehype-unified.md#config) |
| [runtime](runtime-directory.md)              | `.interact`               | A directory that contains temporary runtime information such as cache, schema                                |
| [build](build.md)                            | `dist`                    | A directory where the [build result](build.md) is stored (static website and handler)                        |
| [config file](conf.md)                       | `interact.config.json`    | the [configuration file](conf.md)                                                                            |
| `images`                                     | `src/images`              | a directory that contains [raster image](../components/image.md)  or [Svg](../components/svg.md)             |
| [markdown components](markdown-component.md) | `src/components/markdown` | a directory that contains your custom markdown component                                                     |
| [layouts](layout.md)                         | `src/components/layouts`  | a directory that contains your custom [layouts](layout.md)                                                   |
| [middlewares](middleware.md)                 | `src/middlewares`         | a directory that contains the middlewares for auto-registration                                              |
| [public](public.md)                          | `public`                  | A directory that contains non-processed resources such as `pdf` that your pages may reference.               |
| [pages](page.md)                             | `src/pages`               | A directory that contains [pages](page.md)                                                                   |
| `root`                                       | config file directory     | The base directory of your project                                                                           |

If the path values are relative (ie without starting slash), they are all relative to the `root` directory which is the
directory of your project.

## Configuration

The location of the [config file](conf.md)
can only be [set via flag or environment variable](conf.md#configuration)

All other paths may be configured in the `paths` node of the [configuration file](conf.md)

## How to check the actual values?

With the [cli](cli.md)

```bash
interact config --filter="paths"
```