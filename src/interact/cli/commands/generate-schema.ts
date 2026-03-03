import {Command} from '@oclif/core'
import {z} from 'zod';

import {writeFileSync, mkdirSync} from 'fs'
import {join} from 'path'
import {JsonConfigSchema} from "../../config/jsonConfigSchema";

export default class GenerateSchema extends Command {
  static description = 'Generate JSON schema from Zod configuration'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static enableJsonFlag = false
  static strict = true

  async run(): Promise<void> {
    await this.parse(GenerateSchema)

    const outputDir = join(process.cwd(), 'dist', 'schemas')
    const outputPath = join(outputDir, 'interact.schema.json')

    // Create output directory if it doesn't exist
    mkdirSync(outputDir, {recursive: true})

    // Generate JSON Schema
    const jsonSchema = z.toJSONSchema(JsonConfigSchema)

    // Write to file
    writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2))

    console.log(`✓ JSON Schema generated at ${outputPath}`)
  }
}
