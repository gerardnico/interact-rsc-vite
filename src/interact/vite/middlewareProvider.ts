import type {Plugin} from 'vite';
import type {MiddlewareConfig} from "../config/configSchema.js";
import {getInteractConfig} from "../config/interactConfig.js";
import path from "node:path";

export default function middlewareProvider(): Plugin {
    const virtualId = 'interact:middleware-registry';

    let interactConfig = getInteractConfig()

    let middlewareConfigs: MiddlewareConfig[] = [
        ...interactConfig.pages.providers || [],
        {
            importPath: path.resolve(interactConfig.paths.interactResourcesDirectory, 'middleware/localPagesMiddleware'),
            props: {
                pagesDirectory: interactConfig.paths.pagesDirectory
            }
        }]
    //const resolvedId = '\0' + virtualId;
    const resolvedId = virtualId;
    return {
        name: 'interact-middleware-registry',
        resolveId(id: string) {
            if (id === virtualId) return resolvedId;
        },
        load(id: string) {
            if (id !== resolvedId) return;

            let imports: string[] = [];
            let middlewares: string[] = []
            for (const [i, middleware] of middlewareConfigs.entries()) {
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


            return `
${imports.join('\n')}
export const middlewares = [${middlewares.join(",")}];
      `;
        }
    };
}