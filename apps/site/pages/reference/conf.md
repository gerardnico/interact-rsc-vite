---
title: Configuration file (interact.config.json)
---


The file `interact.config.json` is a JSON file that contains
the configuration of your site.

## Cli
### Schema

To help you in the setting of its values in your editor, you
can generate a schema with the [cli command](cli.md) `schema`.

```bash
interact schema
```

The schema file is generated in the [.interact](runtime-directory.md) directory.

You can then use it in the `$schema` property to get schema validation and completion in your editor.

```json
{
  "$schema": ".interact/interact.schema.json"
}
```

### How to check the actual values?

With the [cli](cli.md)

```bash
interact config
```

## Configuration

The config file path is defined in order of precedence as being the value of:

* the `confPath` [cli flag](cli.md)
* the `INTERACT_CONF_PATH` environment variable if defined
* the current directory with `interact.config.json` as default
