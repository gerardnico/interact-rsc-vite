---
title: Site Search Engine / Search Bot
---

The search engine is responsible for the site content:

* indexation
* and queries (shown in the [search box](../components/searchbox.md))

## Options/Guideline

### Which content is indexed

As a general rile, we recommend that the search bots index:

* the content of the `main` HTML element.
* and if not found, to default to the `html` element.

Check the documentation of your search engine to see how to configure it.

## How to exclude content

To exclude text from indexation in your [layout](layout.md),
you need to set the `data-noindex` attribute on your HTML elements.
