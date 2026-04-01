'use client'

import React from 'react'

// noinspection JSUnusedGlobalSymbols - dynamically imported
export default function Counter() {
    const [count, setCount] = React.useState(0)

    return (
        <button className="p-3 rounded-4xl bg-primary text-primary-foreground" onClick={() => setCount((c) => c + 1)}>Click me ! Count is {count}</button>
    )
}
