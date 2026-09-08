---
title: Search Box
---

The `search box` is a client component that:

* accepts a search query
* and shows the results returned by the [search engine](../reference/search.md).


## Features

* Keyboard binding:
  * Open/close on `Ctrl+K` or `⌘+K`
  * Close on `Esc`
* Cancel Query button
* Bottom Legend
* Query Debounce
* Up and Down Arrow Keyboard Navigation
* Singleton pattern (to show the dialog once globally)
* Error handling (fatal vs request)

## Syntax

If you want to use it in a custom [layout](../reference/layout.md)

```tsx
// you import it like that
import SearchBox from "@combostrap/interact/components/SearchBox";
// and use it in your React component like that
<SearchBox/>
```