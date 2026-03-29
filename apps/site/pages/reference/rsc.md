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
makes it a `Client component` (ie [interactive component](interactive-component.md))

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

## Support

### Only plain objects error

You may get this error

```text
Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
  <... page={Module} request={Request}>
            ^^^^^^^^
    at renderModelDestructive (/home/admin/code/combostrap/interact/apps/site/.interact/.vite/deps_rsc/@vitejs_plugin-rsc_vendor_react-server-dom_server__edge.js:4602:19)
    at renderModel (/home/admin/code/combostrap/interact/apps/site/.interact/.vite/deps_rsc/@vitejs_plugin-rsc_vendor_react-server-dom_server__edge.js:4393:18)
    at Object.toJSON (/home/admin/code/combostrap/interact/apps/site/.interact/.vite/deps_rsc/@vitejs_plugin-rsc_vendor_react-server-dom_server__edge.js:4189:20)
    at stringify (<anonymous>)
    at node:internal/process/task_queues:151:7
    at AsyncResource.runInAsyncScope (node:async_hooks:211:14) {stack: "Error: Only plain objects, and a few built-ins, ca…esource.runInAsyncScope (node:async_hooks:211:14)",
message: "Only plain objects, and a few built-ins, can be pa…={Module} request={Request}>\n            ^^^^^^^^"}
```

This error is mostly due because an imported component has the value `null`.

Example, the imported `NavBar` value below is `null`

```javascript
import {NavBar} from "interact:components";
```

Why? Here are the possible reasons:

* the component does not exist in the imported module.
* The imported component from the `interact:components` module was not registered in
  the [component section of the configuration file](conf.md)
* your [layout component](layout.md) is a [client component](#use-client) and it should not. 
