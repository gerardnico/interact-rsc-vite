import type {Plugin} from "vite";
import type {Config} from "../config/jsonConfigSchema";


export default function ConfVirtualModulePlugin(data: Config): Plugin {
    const virtualModuleId = 'interact:conf'

    /**
     * We don't prefix with \0 as specified here:
     * In vite 7, we got this error:
     * [vite] Internal server error: The argument 'path' must be a string, Uint8Array, or URL without null bytes. Received '\x00interact:conf'
     */
    const resolvedVirtualId = virtualModuleId

    const watchedFile = data.env.configFilePath;
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
            let jsonConfig = JSON.stringify(data)

            return `
          export const conf = ${jsonConfig}
          export default conf
        `

        },

        configureServer(server) {

            server.watcher.add(watchedFile)

            server.watcher.on('change', (file) => {
                if (!file.endsWith(watchedFile)) return

                if (!loadedEnv) {
                    return;
                }
                let environment = server.environments[loadedEnv];

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
