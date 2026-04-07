import type {Plugin} from 'vite';
import {getInteractConfig} from "../config/interactConfig.js";
import path from "node:path";

export default function middlewareProvider(): Plugin {

    let moduleName = 'interact:middlewares';
    let interactConfig = getInteractConfig()

    //const resolvedId = '\0' + virtualId;
    const resolvedId = moduleName;

    return {
        name: moduleName,
        resolveId(id: string) {
            if (id === moduleName) return resolvedId;
        },
        load(id: string) {
            if (id !== resolvedId) return;

            let imports: string[] = [];
            let middlewares: string[] = []
            for (const [i, middleware] of interactConfig.middleware.pipeline.entries()) {
                let importPath = middleware.importPath;
                if (importPath.startsWith("./")) {
                    importPath = path.resolve(interactConfig.paths.rootDirectory, importPath);
                }
                imports.push(`import * as m${i} from '${importPath}';`);
                let name = middleware.name;
                if (name == null) {
                    name = path.basename(importPath);
                }
                middlewares.push(`{
                    name: ${JSON.stringify(name)},
                    handler: await m${i}.handler(${JSON.stringify(middleware.props ?? {})})
                }`)
            }

            console.log(`${moduleName} - Loaded with ${middlewares.length} middlewares`);
            return `
${imports.join('\n')}
export const middlewares = [${middlewares.join(",")}];
      `;
        }
    };
}