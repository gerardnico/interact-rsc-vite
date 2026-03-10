import {z} from 'zod';

import {writeFileSync, mkdirSync} from 'fs'
import {join} from 'path'
import {JsonConfigSchema} from "../../config/configSchema.js";
import {BaseCommand} from "../baseCommand.js";
import {resolveInteractConfig, resolveInteractConfPath} from "../../config/configHandler.js";

export default class Schema extends BaseCommand<typeof Schema> {
  static description = 'Generate JSON schema'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static enableJsonFlag = false
  static strict = true

  async run(): Promise<void> {

    const {flags} = await this.parse(Schema)
    const resolvedConfPath = resolveInteractConfPath(flags.confPath);
    const interactConfigTyped = resolveInteractConfig(resolvedConfPath);
    const outputDir = interactConfigTyped.paths.runtimeDirectory
    const outputPath = join(outputDir, 'interact.schema.json')

    // Create output directory if it doesn't exist
    mkdirSync(outputDir, {recursive: true})

    // Generate JSON Schema
    // Why input: ZodDefault is now reflected as optional with io: "input".
    // https://github.com/colinhacks/zod/issues/4134
    const jsonSchema = z.toJSONSchema(JsonConfigSchema, { io: "input" })

    // Write to file
    writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2))

    console.log(`✓ JSON Schema generated at ${outputPath}`)
  }
}
