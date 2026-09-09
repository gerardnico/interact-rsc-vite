---
title: Context components
description: A context component is a component that wraps the Browser React Application
---

`context components` are [components](component.md) that wraps the React tree.

They provides:

* [a React Context](https://react.dev/learn/passing-data-deeply-with-context) (ie tracker, url state
  manager, ...)
* [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

## Example: Client Tracker

With the [Posthog Tracker](https://posthog.com/docs/error-tracking/installation/react), you would create the following
file `PostHogContext.tsx` in the [contexts directory](directory-layout.md#configuration) - default to
`src/components/contexts`

```tsx
import {PostHogProvider} from '@posthog/react'

export default function PostHogContext({children}: { children: ReactNode }) {
    let apiKey = import.meta.env.INTERACT_POSTHOG_API_KEY
    if (apiKey == null || apiKey == '') {
        console.error("The INTERACT_POSTHOG_API_KEY env is not defined.")
        return children;
    }
    return (
        <PostHogProvider apiKey={"xxx"}>
            {children}
        </PostHogProvider>
    )
}
```

## Syntax

They:

* are considered a [client component unless their name include server](#server-vs-client-context)
* accepts no props (but you can [inject env](env.md#env-value-injection-with-importmetaenv))
* should export the component as `default`

```javascript
export default function MyContextProvider({children}: { children: ReactNode }) {
}
```

## How to list all context components

`context components` are registered components. You can see them by running the [interact config command](conf.md#cli)

```bash
interact config -f components
# to select only the context component with yq
interact config -f components | yq 'to_entries | map(select(.value.type == "context")) | from_entries'
```

Example output:

```yaml
InteractContext:
  importPath: "@combostrap/interact/components/contexts/InteractContext"
  type: context
```

## Registration / Default Directory

To register a context component automatically, you can save it in
the [contexts directory](../reference/directory-layout.md)
(By default, `src/components/contexts`)

You can also register it manually by:

* adding it in the `components` section of the [configuration file](../reference/conf.md)
* and setting the [type](../reference/component.md#type) to `context`

```json
{
  "components": {
    "myContext": {
      "importPath": "src/components/MyContext.tsx",
      "type": "context"
    }
  }
}
```

## Interact Context

The `InteractContext` provides:

* an [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
* the [search engine](search.md)

## Server vs Client Context

A context component can only be found:

* in the browser
* or in the server

They are considered a [client component](rsc.md#client-component) unless their name include `server`