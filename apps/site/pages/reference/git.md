---
layout: holy
title: Git
---


## gitignore

Ignore the [runtime directory](runtime-directory.md)
```gitignore
.interact
node_modules
```

## Adapt your .gitattributes to accept image

```gitattributes
# all files LF
* text eol=lf

*.cmd text eol=crlf
*.bat text eol=crlf

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.webp binary
```

## Support

### Warning: in the working copy of 'image.png', CRLF will be replaced by LF the next time Git touches it

See [adapt-your-gitattributes-to-accept-image](#adapt-your-gitattributes-to-accept-image)