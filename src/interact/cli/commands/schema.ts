import {z} from 'zod';

import {writeFileSync, mkdirSync} from 'fs'
import {join} from 'path'
import {JsonConfigSchema} from "../../config/configSchema.js";
import {BaseCommand} from "../baseCommand.js";
// interactConfig should be relative path and not the package.json export as this is used by the client
import {createInteractConfig} from "../../config/interactConfig.js";



// noinspection JSUnusedGlobalSymbols
export default class Schema extends BaseCommand<typeof Schema> {
    static description = 'Generate JSON schema'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static enableJsonFlag = false
    static strict = true

    async run(): Promise<void> {

        const {flags} = await this.parse(Schema)
        const interactConfigTyped = createInteractConfig(flags.confPath);
        const outputDir = interactConfigTyped.paths.cacheDirectory
        const outputPath = join(outputDir, 'interact.schema.json')

        // Create output directory if it doesn't exist
        mkdirSync(outputDir, {recursive: true})

        // Generate JSON Schema
        // Why input: ZodDefault is now reflected as optional with io: "input".
        // https://github.com/colinhacks/zod/issues/4134
        const jsonSchema = z.toJSONSchema(JsonConfigSchema, {io: "input"})

        // Write to file
        writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2))

        console.log(`✓ JSON Schema generated at ${outputPath}`)
    }
}
