import type {Plugin} from 'vite';
import {getInteractConfig} from "../config/interactConfig.js";
import path from "path";

function generateSearchProviderModule({importPath, props = {}}: {
    importPath: string,
    props?: Record<string, unknown>
}): string {

    if (importPath == null) {
        throw new Error(`Search Provider import path not defined`);
    }
    const importName = "SearchEngine";
    const importStatement = `import ${importName} from ${JSON.stringify(importPath)};`;
    const jsonProperties = JSON.stringify(props);

    return `
${importStatement}

function isClass(value) {
    return (
        typeof value === "function" &&
        /^class\\s/.test(Function.prototype.toString.call(value))
    );
}

let properties = ${jsonProperties};
const searchEngineInstance = isClass(${importName})
    ? new ${importName}(properties)
    : ${importName}(properties);

export default searchEngineInstance;
`;
}

export default function viteSearchProvider(): Plugin {

    const moduleName = 'interact:search-provider';
    const interactConfig = getInteractConfig()
    return {
        name: moduleName,
        // ResolveId Hook: https://rollupjs.org/plugin-development/#resolveid
        resolveId(id) {
            if (id === moduleName) {
                return moduleName;
            }
            return null;
        },
        // Load Hook: https://rollupjs.org/plugin-development/#load
        async load(id) {

            if (id !== moduleName) {
                return null;
            }

            console.log(`${moduleName} - Search Provider Module loaded`);
            const importPath: string | undefined = path.resolve(interactConfig.paths.interactResourcesDirectory, 'search/pagefind/pagefind-browser.ts');
            const props = {};
            const provider = generateSearchProviderModule({importPath, props});
            return provider;

        }
    };
}