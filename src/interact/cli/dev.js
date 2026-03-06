#!/usr/bin/env tsx
// ts-node is mandatory but the command get warning
//#!/usr/bin/env -S node --loader ts-node/esm --disable-warning=ExperimentalWarning

// The dev script
// debug it with
// DEBUG=oclif:* .../dev.js

import {execute} from '@oclif/core'

await execute({development: true, dir: import.meta.url})
