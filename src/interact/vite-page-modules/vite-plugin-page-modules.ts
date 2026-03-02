import type {Plugin} from 'vite';
import {glob} from 'glob';
import path from 'path';

export function generatePageModulesCode(pagesDir: string, files: string[]): string {
    const imports = files.map((file, i) =>
        `import * as Page${i} from ${JSON.stringify(path.join(pagesDir, file))};`
    ).join('\n');

    const entries = files.flatMap((file, i) => {
        const base = file.replace(/\.mdx$|\.tsx$/, '');
        const route = base === 'index' ? '/' : `/${base}`;
        const entries = [`  ${JSON.stringify(route)}: Page${i}`];
        if (base === 'index') entries.push(`  "/index": Page${i}`);
        return entries;
    }).join(',\n');

    return `
${imports}

export const modulePages = {
${entries}
};

export function getModulePage({ path, notFoundPath }) {
    let module = modulePages[path]
    if (module) {
        return module;
    }
    if (!notFoundPath) {
        return;
    }
    return modulePages[notFoundPath]
}

export default getModulePage;
  `.trim();
}

export default function pageModulesPlugin(pagesDir: string): Plugin {
    const virtualModuleId = 'interact:page-modules';
    /**
     * We don't prefix with \0 as specified here:
     * https://vite.dev/guide/api-plugin#virtual-modules-convention
     * because it does not work
     * * We saw this error: [vite] Internal server error: The argument 'path' must be a string, Uint8Array, or URL without null bytes. Received '\x00interact:page-modules'
     * * And the module is not found anymore jn the module grpah
     */
    const resolvedVirtualModuleId = virtualModuleId;

    let loadedEnv = "";
    return {
        name: 'vite-plugin-page-modules',
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        async load(id) {
            if (id !== resolvedVirtualModuleId) {
                return;
            }
            let context = this
            loadedEnv = context.environment.name;
            console.log(`${virtualModuleId} Loaded in env ${loadedEnv}`);
            const files = glob.sync('**/*.{mdx,tsx,jsx}', {cwd: pagesDir});
            return generatePageModulesCode(pagesDir, files);
        },
        // https://vite.dev/guide/api-plugin#configureserver
        configureServer(server) {

            const invalidate = (file: string) => {

                let eventInPages = !file.startsWith(pagesDir + path.sep);
                if (eventInPages) {
                    return
                }

                /**
                 * Loaded env should be rsc
                 *
                 * In vite 7, the modules are managed by environment
                 * server.moduleGraph.invalidateModule(module) will not work
                 * server.moduleGraph.getModuleById(module) will not work
                 *
                 * It seems that this is because rsc is a new env and is therefore unknown
                 * to the server.moduleGraph function
                 *
                 * See: https://vite.dev/guide/api-environment#backward-compatibility
                 * where they said: `The server.moduleGraph returns a mixed view of the client and ssr module graphs.`
                 * (ie not rsc then)
                 */
                if (!loadedEnv) {
                    return;
                }
                let environment = server.environments[loadedEnv];

                let module = environment.moduleGraph.getModuleById(virtualModuleId);
                // undefined because it may be not loaded
                if (module) {
                    environment.moduleGraph.invalidateModule(module)
                    // HMR - broadcast a full reload events to the client
                    // https://vite.dev/guide/api-plugin#handlehotupdate
                    // https://vite.dev/guide/api-plugin#server-to-client
                    // WebSocket server with `send(payload)` method
                    // https://vite.dev/guide/api-javascript#vitedevserver
                    server.ws.send({type: 'full-reload'})
                }

            }

            // Watch a specific directory
            server.watcher.add(pagesDir);

            // Trigger on added or deleted file, directory
            // https://github.com/paulmillr/chokidar/tree/3.6.0#api
            server.watcher.on('add', invalidate) // file added
            server.watcher.on('unlink', invalidate) // removed file
            server.watcher.on('addDir', invalidate) // added directory
            server.watcher.on('unlinkDir', invalidate) // deleted directory
        },
    };
}