import {z} from 'zod';

import {writeFileSync, mkdirSync} from 'fs'
import {join, resolve} from 'path'
import {JsonConfigSchema} from "../../config/configSchema.js";
// interactConfig should be relative path and not the package.json export as this is used by the client
import {createInteractConfig} from "../../config/interactConfigHandler.js";

export interface SchemaActionOptions {
    confPath?: string;
}

export async function schema({confPath}: SchemaActionOptions): Promise<void> {
    let outputDir;
    try {
        const interactConfigTyped = createInteractConfig(confPath);
        outputDir = interactConfigTyped.paths.runtimeDirectory
    } catch (_e) {
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
