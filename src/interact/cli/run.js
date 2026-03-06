#!/usr/bin/env node
// The production script

import {execute} from '@oclif/core'

await execute({dir: import.meta.url})
