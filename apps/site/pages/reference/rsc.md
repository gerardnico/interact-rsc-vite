# React Server Component (Rsc)

`Interact` is a [Rsc server](https://react.dev/reference/rsc/server-components).

By default, all React components runs on the server and are [server components](#server-component).

## Server Component

By default, all React Components:

* runs on the server and can call server module. For instance, if it runs on Node, you can import and call
  all [Nodes module](https://nodejs.org/docs/latest/api/)
* but they don't have access to the Browser (no `window`, `click`, ...)

If a component needs interactivity or the browser environment, you need
to make it a client component with the [use client](#use-client) directive.

## Use client

The `use client` directive when found at the top of a script
makes it a `Client component`

A `React Client component` will:

* be shipped to the browser
* but it will also run on the server

Example: If you use the `window` global, you may:

* move it into a `useEffect` (client-only)

```tsx 
`use client`
export default function MyComponent() {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        setWidth(window.innerWidth);
    }, []);
}
```

* or guard it

```javascript
const width = typeof window !== "undefined" ? window.innerWidth : 0;
```

