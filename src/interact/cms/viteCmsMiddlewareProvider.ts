import type {Plugin} from 'vite';

export function viteCmsMiddlewareProvider(modules: { importPath: string; props?: Record<string, unknown> }[]): Plugin {
    const virtualId = 'interact:cms-provider';
    //const resolvedId = '\0' + virtualId;
    const resolvedId = virtualId;
    return {
        name: 'interact-cms-provider',
        enforce: "post",// runs after as we depend on the component plugin
        resolveId(id: string) {
            if (id === virtualId) return resolvedId;
        },
        load(id: string) {
            if (id !== resolvedId) return;

            const imports = modules.map((m, i) => `import * as m${i} from '${m.importPath}';`).join('\n');
            const handlers = modules.map((m, i) =>
                `await m${i}.handler(${JSON.stringify(m.props ?? {})})`
            ).join(', ');

            return `
${imports}
export const cmsHandlers = [${handlers}];
      `;
        }
    };
}