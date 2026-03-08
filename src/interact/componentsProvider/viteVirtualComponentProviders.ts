import type {Plugin} from 'vite';
import path from 'path';
import type {InteractConfigType} from "../config/configSchema.js";

export function generateComponentProvider(interactConfig: InteractConfigType): string {

    let imports = [];
    let mdxMappingElementNameComponentName = []
    let exports = [];
    for (const [key, value] of Object.entries(interactConfig.components)) {
        let importName = path.basename(value.importPath)
        imports.push(`import ${importName} from ${JSON.stringify(value.importPath)};`);
        /**
         * Mdx Function Providers get only the leaf component
         */
        if (value.type == "leaf") {
            mdxMappingElementNameComponentName.push(`${key}:${importName}`)
        }
        /**
         * We export all component so that they can be used
         */
        exports.push(importName);
    }

    /**
     * MDXComponents represents the components prop.
     * MDX will call this function to resolve components
     * See https://mdxjs.com/guides/injecting-components/
     */
    return `
${imports.join('\n')}

export function useMDXComponents() {
  return {
    ${mdxMappingElementNameComponentName.join(',\n')}
  }
}

export { ${exports.join(', ')} };
`;
}

export default function viteMdxComponentProvider({moduleName = 'interact:mdx-component-provider', interactConfig}: {
    moduleName: string,
    interactConfig: InteractConfigType
}): Plugin {

    /**
     * We don't prefix with \0 as specified here:
     * https://vite.dev/guide/api-plugin#virtual-modules-convention
     * because it does not work
     * * We saw this error: [vite] Internal server error: The argument 'path' must be a string, Uint8Array, or URL without null bytes. Received '\x00interact:page-modules'
     * * And the module is not found anymore jn the module grpah
     */
    const resolvedVirtualModuleId = moduleName;

    return {
        name: moduleName,
        // ResolveId Hook: https://rollupjs.org/plugin-development/#resolveid
        resolveId(id) {
            if (id === moduleName) {
                return resolvedVirtualModuleId;
            }
            return null;
        },
        // Load Hook: https://rollupjs.org/plugin-development/#load
        async load(id) {
            if (id !== resolvedVirtualModuleId) {
                return null;
            }

            console.log(`${moduleName} module loaded with ${Object.keys(interactConfig.components).length} components`);
            return generateComponentProvider(interactConfig);
        }
    };
}