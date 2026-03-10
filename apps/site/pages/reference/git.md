---
layout: holy
title: Git
---

## Adapt your .gitattributes to accept image

```
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.webp binary

# all files LF
*.cmd text eol=crlf
*.bat text eol=crlf
* text eol=lf
```

## Support

### Warning: in the working copy of 'image.png', CRLF will be replaced by LF the next time Git touches it

See [adapt-your-gitattributes-to-accept-image](#adapt-your-gitattributes-to-accept-image)