import type {Plugin} from 'vite';
import path from 'path';
import {getInteractConfig, type InteractConfig} from "../config/interactConfig.js";

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

export function generateLayoutProvider(interactConfig: InteractConfig): {
    content: string;
    layouts: Record<string, string>
} {

    let imports = [];
    let layoutComponents: Record<string, string> = {};

    // component may be registered multiple time
    // for instance, code is registered for the pre element and itself as Code,
    // but it should be exported only once
    let exports = new Set<string>();
    for (const [key, value] of Object.entries(interactConfig.components)) {

        /**
         * Layout
         */
        if (value.type != "layout") {
            continue;
        }

        /**
         * Import Path
         */
        let importPath = value.importPath;
        if (importPath == null) {
            throw new Error(`Import ${importPath} not defined for the layout component ${key}`);
        }

        /**
         * Import name
         * Cannot come from the path "./pages/404.js",404 is a number and is not valid as component name but valid as path
         */
        let importName = key;

        /**
         * Map
         */
        let layoutKey = key.toLowerCase();
        layoutComponents[layoutKey] = importName;

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


    }

    /**
     * Below useMDXComponents represents the components prop.
     * MDX will call this function to resolve components
     * See https://mdxjs.com/guides/injecting-components/
     */

    let layoutComponentAsJavascriptStringObject = toJsString(layoutComponents);
    let virtualModuleContent = `
${imports.join('\n')}

const layoutComponents = ${layoutComponentAsJavascriptStringObject};
export function getLayoutComponent(name) {
  return layoutComponents[name];
}

export { ${[...exports].join(', ')} };

// to not return null
const dontUse = () => "Don't use the default export";
export default dontUse 
`;
    return {
        content: virtualModuleContent,
        layouts: layoutComponents
    }
}

export default function viteLayoutProvider(): Plugin {

    /**
     * interact config is not a props so that on dev server
     * restart the new configuration is read
     */
    let interactConfig = getInteractConfig();
    /**
     * The name used in the import
     * ie import .... from 'interact:layouts'
     */
    let moduleName = 'interact:layouts';

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

            let layoutProvider = generateLayoutProvider(interactConfig);
            console.log(`${moduleName} module loaded with ${Object.keys(layoutProvider.layouts).length} layouts`);

            return layoutProvider.content;
        }
    };
}