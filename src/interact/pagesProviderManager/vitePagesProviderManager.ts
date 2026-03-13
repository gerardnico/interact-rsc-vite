import type {Plugin} from 'vite';
import type {PageProvider} from "../config/configSchema.js";

export function vitePagesProviderManager(pageProviders: PageProvider[]): Plugin {
    const virtualId = 'interact:pages-provider-manager';
    //const resolvedId = '\0' + virtualId;
    const resolvedId = virtualId;
    return {
        name: 'interact-pages-provider-manager',
        resolveId(id: string) {
            if (id === virtualId) return resolvedId;
        },
        load(id: string) {
            if (id !== resolvedId) return;

            const imports = pageProviders.map((m, i) => `import * as m${i} from '${m.importPath}';`).join('\n');
            const handlers = pageProviders.map((m, i) =>
                `await m${i}.handler(${JSON.stringify(m.props ?? {})})`
            ).join(', ');

            return `
${imports}
export const pagesProviderHandlers = [${handlers}];
      `;
        }
    };
}