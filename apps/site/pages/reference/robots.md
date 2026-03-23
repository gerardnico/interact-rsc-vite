---
title: Crawl, Search and other bots
---

This page is about how you can pass instructions to bots
crawling your website.

Note that they are merely instructions and that the bots
may just ignore them.

## Configuration

### robots meta

You can set instruction for a page with the `robots` meta of the [frontmatter](frontmatter.md)

The common directives are:

* `noindex`: exclude the page of the search index
* and `nofollow`: don't follow links on the page

The default value is: `index, follow`

Examples to disallow index and link follow

```yaml
robots: noindex, nofollow
```

### robots.txt

You can give instruction to bot that crawl your website via a [robots.txt](https://en.wikipedia.org/wiki/Robots.txt)

This file should be written in the [public directory](directory-layout.md)

Example: To disallow the file `/directory/file.html` to be crawled and indexed.

```robotstxt
User-agent: *
Disallow: /directory/file.html
```
