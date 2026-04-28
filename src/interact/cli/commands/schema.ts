import {z} from 'zod/v4';

import {writeFileSync, mkdirSync} from 'fs'
import {join, resolve} from 'path'
import {JsonConfigSchema} from "../../config/configSchema.js";
import {BaseCommand} from "../baseCommand.js";
// interactConfig should be relative path and not the package.json export as this is used by the client
import {createInteractConfig} from "../../config/interactConfigHandler.js";


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

        let outputDir;
        try {
            const interactConfigTyped = createInteractConfig(flags.confPath);
            outputDir = interactConfigTyped.paths.runtimeDirectory
        } catch (e) {
            // as of now, the configuration file may have an error
            outputDir = resolve(process.cwd(), ".interact")
        }
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
