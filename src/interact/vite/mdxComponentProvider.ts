/**
 * Module that provides the Markdown component
 */
import type {Plugin} from 'vite';
import path from 'path';
import {getInteractConfig, type InteractConfig} from "../config/interactConfig.js";
import {componentsProviderModuleName} from "../markdown/conf/markdownConfig.js";

/**
 * Print without any quote so that the object can be added to virtual module
 */
function toJsString(value: any, indent = 0): any {
    const pad = ' '.repeat(indent + 2);
    const closePad = ' '.repeat(indent);

    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return value;  // no quotes
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) {
        // @ts-ignore
        const items = value.map(v => `${pad}${toJsString(v, indent + 2)}`);
        return `[\n${items.join(',\n')}\n${closePad}]`;
    }
    if (typeof value === 'object') {

        // @ts-ignore
        const entries = Object.entries(value).map(
            // @ts-ignore
            ([k, v]) => {
                /**
                 * The key value may be my-component
                 * The Javascript string result should be then 'my-component'
                 */
                if (k.includes("-")) {
                    k = `'${k}'`
                }
                return `${pad}${k}: ${toJsString(v, indent + 2)}`
            }
        );
        return `{\n${entries.join(',\n')}\n${closePad}}`;
    }
    return String(value);
}

export function generateComponentProvider(interactConfig: InteractConfig): string {

    let imports = [];

    // component may be registered multiple time
    // for instance, code is registered for the pre element and itself as Code,
    // but it should be exported only once
    let exports = new Set<string>();
    let mdxMappingElementNameComponentName: Record<string, string> = {};
    for (const [key, value] of Object.entries(interactConfig.components)) {

        if (value.type != "markdown") {
            continue
        }

        /**
         * Import Path
         */
        let importPath = value.importPath;
        if (importPath == null) {
            throw new Error(`Import path not defined for the ${value.type} component ${key}`);
        }

        /**
         * Import name
         */
            // Cannot come from the path "./pages/404.js",404 is a number and is not valid as component name but valid as path
        let importName = key;

        if (!exports.has(importName)) {

            /**
             * We export all component so that they can be used
             */
            exports.add(importName);

            /**
             * Relative to Absolute
             */
            if (importPath.startsWith("./")) {
                importPath = path.resolve(interactConfig.paths.rootDirectory, importPath);
            }

            /**
             * Import statement
             */
            imports.push(`import ${importName} from ${JSON.stringify(importPath)};`);

        }
        /**
         * Markdown Function Providers get only the content component
         */
        if (value.type == "markdown") {
            mdxMappingElementNameComponentName[key] = importName
        }


    }

    /**
     * Below useMDXComponents represents the components prop.
     * MDX will call this function to resolve components
     * See https://mdxjs.com/guides/injecting-components/
     */

    let mdMappingAsJavascriptStringObject = toJsString(mdxMappingElementNameComponentName);

    return `
${imports.join('\n')}

export function useMDXComponents() {
  return ${mdMappingAsJavascriptStringObject}
}

export { ${[...exports].join(', ')} };

// to not return null
const dontUse = () => "Don't use the default export";
export default dontUse 
`;
}

export default function viteComponentProvider(): Plugin {

    let interactConfig = getInteractConfig()
    let moduleName = componentsProviderModuleName;
    /**
     * We don't prefix with \0 as specified here:
     * https://vite.dev/guide/api-plugin#virtual-modules-convention
     * because it does not work
     * * We saw this error: [vite] Internal server error: The argument 'path' must be a string, Uint8Array, or URL without null bytes. Received '\x00interact:page-modules'
     * * And the module is not found anymore jn the module graph
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
            let provider = generateComponentProvider(interactConfig);
            return provider;
        }
    };
}