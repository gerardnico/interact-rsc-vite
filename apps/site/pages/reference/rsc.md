---
title: React Server Component (Rsc)
---

`Interact` is a [Rsc server](https://react.dev/reference/rsc/server-components).

By default, all React components runs on the server and are [server components](#server-component).

## Component Types

### Server Component

By default, all React Components:

* runs on the server and can call server module. For instance, if it runs on Node, you can import and call
  all [Nodes module](https://nodejs.org/docs/latest/api/)
* but they don't have access to the Browser (no `window`, `click`, ...)

If a component needs interactivity or the browser environment, you need
to make it a client component with the [use client](#client-component) directive.

### Client Component

The [React use client directive](https://react.dev/reference/rsc/server-components#adding-interactivity-to-server-components)
when found at the top of a script
makes it a `Client component` (ie [interactive component](interactive-component.md))

A `React Client component` will:

* be shipped to the browser
* but it will also run on the server in SSR mode

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

This error is mostly due because a component or props in the React tree has the value `null`.

Why? Here are the possible reasons:

* the component does not exist in the imported module. Example, the imported `NavBar` value below may be `null` if the
  component is not exported by default.

```javascript
import NavBar from "my-navbar";
```

* your [layout component](layout.md) is a [client component](#client-component) and it should not. The client component is in
  the client bundle and will return null on the server.
* you are passing a props with a null value. Example: This [partial](layout.md#partials) is passing the whole props but
  the layout props have also the request context that contains null.

```tsx
export default async function Html({page, ...props}: LayoutProps) {

    return (
        <html {...props}>
        {props.children}
        </html>
    )
}
```

The correct fix is:

```tsx
export default async function Html({page, context, ...props}: LayoutProps) {
}
```

### Invalid Hook Call Warning in Rsc environment

In React, you may get the injurious [invalid hook call warning](https://react.dev/warnings/invalid-hook-call-warning).

In Rsc, this problem may occur because you might have more than one copy of React due to bad splitting.

Why? The bundler needs to parse every file that have the [use client directive](#client-component) in order
to split correctly the code between the client and the servers environments (rsc/ssr).

By default, in SSR, all dependencies are externalized and are not processed (except for linked dependencies for HMR).
Therefore, the React library dependency needs to be listed in
the [noExternal properties](https://vite.dev/config/ssr-options#ssr-noexternal).

We do it for you by scanning your `package.json` in search of library with `react` in their `dependencies` and
`peerDependencies` properties.

If the incriminated dependency is a React library, you can:

* add react as  `peerDependencies`
* or create your [vite configuration](vite.md) and adding the library in
  the [noExternal properties](https://vite.dev/config/ssr-options#ssr-noexternal) for the server environments (`ssr` and
  `rsc`)
