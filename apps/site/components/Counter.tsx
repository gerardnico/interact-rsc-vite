'use client'

import React from 'react'

export default function Counter() {
  const [count, setCount] = React.useState(0)

  return (
    <button className="btn btn-primary" onClick={() => setCount((c) => c + 1)}>Click me ! Count is {count}</button>
  )
}
