---
title: Content Component
---

Content component are [components](component.md#type) that may appear in the content of [Markdown](markdown.md)
and [mdx page](mdx.md)

## How to create your own content component

See [How to add a Markdown component](../howto/add-a-content-component.md)

## Default Element

By default, the standard HTML element mapped by the [standard Markdown](https://commonmark.org/)
adapted from [Mdx table of components](https://mdxjs.com/table-of-components/)

<table class="table">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Markdown syntax</th>
        <th scope="col">Equivalent HTML</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">`a`</th>
        <td>
```markdown
[Combo](https://combostrap.com "title")
```
        </td>
        <td>
```html
<p><a href="https://combostrap.com" title="title">Combo</a></p>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`blockquote`</th>
        <td>
```markdown
> A greater than…
```
        </td>
        <td>
```html
<blockquote>
  <p>A greater than…</p>
</blockquote>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`br`</th>
        <td>
          ```markdown
          A backslash\
          before a line break…
          ```
        </td>
        <td>
```html
<p>
  A backslash<br/>
  before a line break…
</p>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`code`</th>
        <td>
````markdown
Some `backticks` for inline.

```javascript
backtick.fences('for blocks')
```

````
        </td>
        <td>
```html
<p>
  Some <code>backticks</code> for inline.
</p>
<pre>
  <code className="language-javascript">backtick.fences('for blocks')</code>
</pre>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`em`</th>
        <td>
```markdown
Some *asterisks* for emphasis.
```
        </td>
        <td>
```html
<p>Some <em>asterisks</em> for emphasis.</p>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`h1`</th>
        <td>
```markdown
# One number sign…
```
        </td>
        <td>
```html
<h1>One number sign…</h1>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`h2`</th>
        <td>
```markdown
## Two number signs…
```
        </td>
        <td>
```html
<h2>Two number signs…</h2>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`h3`</th>
        <td>
```markdown
### Three number signs…
```
        </td>
        <td>
```html
<h3>Three number signs…</h3>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`h4`</th>
        <td>
```markdown
#### Four number signs…
```
        </td>
        <td>
```html
<h4>Four number signs…</h4>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`h5`</th>
        <td>
```markdown
##### Five number signs…
```
        </td>
        <td>
```html
<h5>Five number signs…</h5>
```
      </td>
      <tr>
        <th scope="row">`h6`</th>
        <td>
```markdown
###### Six number signs…
```
        </td>
        <td>
```html
<h6>Six number signs…</h6>
```
        </td>
      </tr>
      </tr>
      <tr>
        <th scope="row">`hr`</th>
        <td>
```markdown
Three asterisks for a thematic break:

***
```
        </td>
        <td>
```html
<p>Three asterisks for a thematic break:</p>
<hr />
```
        </td>
      </tr>
      <tr>
        <th scope="row">`img`</th>
        <td>
```markdown
![Alt text](/logo.png "title")
```
        </td>
        <td>
```html
<p><img src="/logo.png" alt="Alt text" title="title" /></p>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`li`</th>
        <td>
```markdown
* asterisks for unordered items

1. decimals and a dot for ordered items
```
        </td>
        <td>

```html
<ul>
    <li>asterisks for unordered items</li>
</ul>
<ol>
    <li>decimals and a dot for ordered items</li>
</ol>
```

        </td>
      </tr>
      <tr>
        <th scope="row">`ol`</th>
        <td>

```markdown
1. decimals and a dot for ordered
```

        </td>
        <td>

```html

<ol>
    <li>decimals and a dot for ordered</li>
</ol>
```

        </td>
      </tr>
      <tr>
        <th scope="row">`p`</th>
        <td>

```markdown
Just some text…
```

        </td>
        <td>

```html
<p>Just some text…</p>
```

        </td>
      </tr>
      <tr>
        <th scope="row">`pre`</th>
        <td>

````markdown
```javascript
backtick.fences('for blocks')
```
````

        </td>
        <td>

```html

<pre><code class="language-javascript">backtick.fences('for blocks')
  </code></pre>
```

        </td>
      </tr>
      <tr>
        <th scope="row">`strong`</th>
        <td>

```markdown
Two **asterisks** for strong.
```

        </td>
        <td>

```html
<p>Two <strong>asterisks</strong> for strong.</p>
```

        </td>
      </tr>
      <tr>
        <th scope="row">`ul`</th>
        <td>

```markdown
* asterisks for unordered
```

        </td>
        <td>

```html

<ul>
    <li>asterisks for unordered</li>
</ul>
```

        </td>
      </tr>
    </tbody>

</table>


You can add support for more with [unified plugins](remark-rehype-unified.md).
By [default](remark-rehype-unified.md#default), we apply the [Remark Gfm](https://github.com/remarkjs/remark-gfm) to add
the
[GitHub Syntax](https://github.github.com/gfm/)

