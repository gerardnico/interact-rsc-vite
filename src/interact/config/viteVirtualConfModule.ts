import type {Plugin} from "vite";
import path from "path";
import {type ConfPathResolvedType} from "./configHandler.js";
import {fileURLToPath} from "node:url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Provide the interactConfig const
 */
export default function viteVirtualConfModule(resolvedConf: ConfPathResolvedType): Plugin {
    const virtualModuleId = 'interact:config'

    /**
     * We don't prefix with \0 as specified here:
     * In vite 7, we got this error:
     * [vite] Internal server error: The argument 'path' must be a string, Uint8Array, or URL without null bytes. Received '\x00interact:conf'
     */
    const resolvedVirtualId = virtualModuleId

    const watchedFile = resolvedConf.filePath;
    let loadedEnv: string;

    return {
        name: 'interact-conf-module',

        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualId
            }
        },

        load(id) {
            if (id !== resolvedVirtualId) {
                return null
            }
            let context = this

            loadedEnv = context.environment.name;
            console.log(`${virtualModuleId} loaded in env ${loadedEnv}`);
            const configHandlerPath = path.resolve(__dirname, 'configHandler.js');
            return `
import { resolveInteractConfig } from ${JSON.stringify(configHandlerPath)};
export const interactConfig = resolveInteractConfig(${JSON.stringify(resolvedConf)});
export default interactConfig;`
        },

        configureServer(server) {

            server.watcher.add(watchedFile)

            server.watcher.on('change', (file) => {
                if (!file.endsWith(watchedFile)) return

                if (!loadedEnv) {
                    return;
                }
                let environment = server.environments[loadedEnv];

                if(!environment) {
                    return
                }
                let module = environment.moduleGraph.getModuleById(virtualModuleId);

                // You cannot invalidate something that was never instantiated.
                if (module) {
                    // invalidate cache
                    environment.moduleGraph.invalidateModule(module)

                    // trigger HMR update
                    // full refresh, no?
                    server.ws.send({
                        type: 'update',
                        updates: [
                            {
                                type: 'js-update',
                                path: virtualModuleId,
                                acceptedPath: virtualModuleId,
                                timestamp: Date.now()
                            }
                        ]
                    })
                }
            })
        },


    }
}
