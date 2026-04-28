// Instantiate the unified plugins
import {z} from "zod/v4"
import path from 'path';
import {fileURLToPath} from "node:url";

function determinePluginType(pluginConfigPath: string, pluginConfig: PluginConfig | null): string {

    if (pluginConfig != null && pluginConfig.type) {
        return pluginConfig.type
    }
    let lowercasePath = pluginConfigPath.toLowerCase();
    let remark = "remark";
    if (lowercasePath.includes(remark)) {
        return remark;
    }
    let rehype = "rehype";
    if (lowercasePath.includes(rehype)) {
        return rehype
    }
    throw new Error(`The type of the plugin ${pluginConfigPath} is not set and the path does not contain ${remark} or ${rehype}`)

}

let remark = "remark";
let rehype = "rehype";
const PluginConfigSchema = z.object({
    path: z.string().optional(),
    props: z.record(z.string(), z.any()).optional(),
    type: z.enum(['remark', 'rehype']).optional(),
});
export type PluginConfig = z.infer<typeof PluginConfigSchema>;
const PluginConfigSetSchema = z.record(z.string(), PluginConfigSchema.nullable());
export type PluginConfigSetSchemaType = z.infer<typeof PluginConfigSetSchema>;

/**
 * Instantiate the unified plugins from a config object
 * @param plugins
 */
async function instantiatePlugins(plugins: PluginConfigSetSchemaType) {

    const remarkPlugins = [];
    const reHypePlugins = [];

    // Get the directory of the current module (for resolving relative paths)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    for (const [pluginName, pluginConfig] of Object.entries(plugins)) {

        // Resolve the plugin path relative to the config or current directory
        let pluginConfigPath = pluginConfig?.path;
        if (pluginConfigPath == undefined) {
            pluginConfigPath = pluginName;
        }
        const pluginPath = path.resolve(__dirname, '..', 'unified', pluginConfigPath);
        const pluginType = determinePluginType(pluginConfigPath, pluginConfig)

        if (pluginConfig == null) {
            console.log(`Disabled ${pluginType} plugin ${pluginName}`)
            continue;
        }

        // Dynamically import the plugin
        const pluginModule = await import(/* @vite-ignore */ pluginPath);

        // Get the default export or named export
        const plugin = pluginModule.default || pluginModule;

        // Instantiate the plugin with props
        let astroPluginFormat;
        if (pluginConfig.props != undefined) {
            console.log(`Set ${pluginType} plugin ${pluginName} with props`)
            // instantiation is done by Astro (requires an array)
            astroPluginFormat = [plugin, pluginConfig.props];
        } else {
            console.log(`Set ${pluginType} plugin ${pluginName}`)
            astroPluginFormat = plugin
        }
        switch (pluginType) {
            case remark: {
                remarkPlugins.push(astroPluginFormat)
                break
            }
            case rehype: {
                reHypePlugins.push(astroPluginFormat)
                break
            }
            default: {
                throw new Error(`The plugin type ${pluginConfig.type} is unknown`)
            }
        }

    }
    return {
        remark: remarkPlugins,
        rehype: reHypePlugins
    }
}

export default instantiatePlugins