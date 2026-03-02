#!/usr/bin/env tsx

import {run, flush, Errors} from '@oclif/core'

async function main() {
  try {
    await run(undefined, import.meta.url)
    await flush()
  } catch (error) {
    // Handle oclif errors gracefully
    if (error instanceof Error) {
      await Errors.handle(error)
    } else {
      throw error
    }
  }
}

await main()
