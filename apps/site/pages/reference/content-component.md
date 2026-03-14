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

<table>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Markdown syntax</th>
        <th scope="col">Equivalent JSX</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">`a`</th>
        <td>
```mdx
[MDX](https://mdxjs.com "title")
```
        </td>
        <td>
```html
<p><a href="https://mdxjs.com" title="title">MDX</a></p>
```
        </td>
      </tr>
      <tr>
        <th scope="row">`blockquote`</th>
        <td>
```mdx
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
          ```mdx chrome=no
          A backslash\
          before a line break…
          ```
        </td>
        <td>
          ```tsx chrome=no
          <>
            <p>
              A backslash<br />
              before a line break…
            </p>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`code`</th>

        <td>
          ````mdx chrome=no
          Some `backticks` for inline.

          ```javascript
          backtick.fences('for blocks')
          ```
          ````
        </td>

        <td>
          ```tsx chrome=no
          <>
            <p>
              Some <code>backticks</code> for inline.
            </p>
            <pre><code className="language-javascript">backtick.fences('for blocks')
            </code></pre>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`em`</th>

        <td>
          ```mdx chrome=no
          Some *asterisks* for emphasis.
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <p>Some <em>asterisks</em> for emphasis.</p>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`h1`</th>

        <td>
          ```mdx chrome=no
          # One number sign…
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <h1>One number sign…</h1>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`h2`</th>

        <td>
          ```mdx chrome=no
          ## Two number signs…
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <h2>Two number signs…</h2>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`h3`</th>

        <td>
          ```mdx chrome=no
          ### Three number signs…
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <h3>Three number signs…</h3>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`h4`</th>

        <td>
          ```mdx chrome=no
          #### Four number signs…
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <h4>Four number signs…</h4>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`h5`</th>

        <td>
          ```mdx chrome=no
          ##### Five number signs…
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <h5>Five number signs…</h5>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`h6`</th>

        <td>
          ```mdx chrome=no
          ###### Six number signs…
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <h6>Six number signs…</h6>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`hr`</th>

        <td>
          ```mdx chrome=no
          Three asterisks for a thematic break:

          ***
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <p>Three asterisks for a thematic break:</p>
            <hr />
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`img`</th>

        <td>
          ```mdx chrome=no
          ![Alt text](/logo.png "title")
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <p><img src="/logo.png" alt="Alt text" title="title" /></p>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`li`</th>

        <td>
          ```mdx chrome=no
          * asterisks for unordered items

          1. decimals and a dot for ordered items
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <ul>
              <li>asterisks for unordered items</li>
            </ul>
            <ol>
              <li>decimals and a dot for ordered items</li>
            </ol>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`ol`</th>

        <td>
          ```mdx chrome=no
          1. decimals and a dot for ordered
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <ol>
              <li>decimals and a dot for ordered</li>
            </ol>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`p`</th>

        <td>
          ```mdx chrome=no
          Just some text…
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <p>Just some text…</p>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`pre`</th>

        <td>
          ````mdx chrome=no
          ```javascript
          backtick.fences('for blocks')
          ```
          ````
        </td>

        <td>
          ```tsx chrome=no
          <>
            <pre><code className="language-javascript">backtick.fences('for blocks')
            </code></pre>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`strong`</th>

        <td>
          ```mdx chrome=no
          Two **asterisks** for strong.
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <p>Two <strong>asterisks</strong> for strong.</p>
          </>
          ```
        </td>
      </tr>

      <tr>
        <th scope="row">`ul`</th>

        <td>
          ```mdx chrome=no
          * asterisks for unordered
          ```
        </td>

        <td>
          ```tsx chrome=no
          <>
            <ul>
              <li>asterisks for unordered</li>
            </ul>
          </>
          ```
        </td>
      </tr>
    </tbody>

</table>


You can add support for more with [unified plugins](remark-rehype-unified.md).
By [default](remark-rehype-unified.md#default), we apply the [Remark Gfm](https://github.com/remarkjs/remark-gfm) to add
the
[GitHub Syntax](https://github.github.com/gfm/)

