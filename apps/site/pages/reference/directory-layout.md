---
title: Directory Layout
---


A typical interact project is composed of the following paths:

| Name                                         | Default Value             | Description                                                                                                  |
|----------------------------------------------|---------------------------|--------------------------------------------------------------------------------------------------------------|
| [config file](conf.md)                       | `interact.config.json`    | the [configuration file](conf.md)                                                                            |
| `root`                                       | config file directory     | The base directory of your project                                                                           |
| [pages](page.md)                             | `src/pages`               | A directory that contains [pages](page.md)                                                                   |
| `images`                                     | `src/images`              | a directory that contains [raster image](../components/image.md)  or [Svg](../components/svg.md)             |
| [public](public.md)                          | `public`                  | A directory that contains non-processed resources such as `pdf` that your pages may reference.               |
| [layouts](layout.md)                         | `src/components/layouts`  | a directory that contains your custom [layouts](layout.md)                                                   |
| [markdown components](markdown-component.md) | `src/components/markdown` | a directory that contains your custom markdown component                                                     | 
| `config`                                     | `config`                  | a directory that contains extra configuration such as the [markdown config](remark-rehype-unified.md#config) |
| [build](build.md)                            | `dist`                    | A directory where the [build result](build.md) is stored (static website and handler)                        |
| `cache`                                      | `.interact`               | A directory for runtime information                                                                          |
| [@ alias](at-alias.md)                       | `src`                     | A directory that is mapped to the [@ alias](at-alias.md)                                                     |

If the values are relative (ie without starting slash), they are all relative to the `root` directory which is the
directory of your project.

## Configuration

The config file path is defined in order of precedence as being the value of:

* the `confPath` [cli flag](cli.md)
* the `INTERACT_CONF_PATH` environment variable if defined
* the current directory with `interact.config.json` as default

You may configure the other paths in the `paths` node of the [configuration file](conf.md)

## How to check the actual values?

With the [cli](cli.md)

```bash
interact config --filter="paths"
```