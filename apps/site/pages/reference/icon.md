---
title: Icon
---

This page shows you how you can add icons to your [pages](page.md)

## List

### Markdown

You can add a raw svg file in the [image directory](directory-layout.md) and use it
in a [markdown](markdown.md) page with the [Icon](../components/icon.md) element.

```markdown
<Icon src="favicon.svg"/>
```

<Icon src="favicon.svg"/>

### Programmatic Page

#### Import

In a [programmatic page](page-module.md), you can import:
* from a raw svg file

```javascript
import Envelope from "../img/bi-envelope-fill.svg"
```
* from a icon library
```javascript
// that delivers raw svg file
import OpenAiIcon from "bootstrap-icons/icons/openai.svg"
// or React component
import {ChevronDownIcon} from "lucide-react";
```

### CSS font

You can also use a icon stylesheet font.

Example with [Bootstrap Icons](https://icons.getbootstrap.com/)

* Add the stylesheet 
```html

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
```

Usage:

```jsx
<i className="bi bi-linkedin text-primary"></i>
```