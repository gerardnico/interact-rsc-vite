import type {Plugin, ViteDevServer} from "vite";

export default function ConfVirtualModulePlugin(): Plugin {
    const virtualId = 'virtual:my-module'
    const resolvedVirtualId = '\0' + virtualId

    let server:ViteDevServer;

    const watchedFile = 'interact.conf.json'

    return {
        name: 'my-virtual-module',

        configureServer(_server) {
            server = _server

            server.watcher.add(watchedFile)

            server.watcher.on('change', (file) => {
                if (!file.endsWith(watchedFile)) return
                const mod =
                    server.moduleGraph.getModuleById(
                        resolvedVirtualId
                    )
                // You cannot invalidate something that was never instantiated.
                if (mod) {
                    // ✅ invalidate cache
                    server.moduleGraph.invalidateModule(mod)

                    // ✅ trigger HMR update
                    server.ws.send({
                        type: 'update',
                        updates: [
                            {
                                type: 'js-update',
                                path: virtualId,
                                acceptedPath: virtualId,
                                timestamp: Date.now()
                            }
                        ]
                    })
                }
            })
        },


        resolveId(id) {
            if (id === virtualId) {
                return resolvedVirtualId
            }
        },

        load(id) {
            if (id === resolvedVirtualId) {
                // const content = fs.readFileSync(
                //     path.resolve('data.txt'),
                //     'utf-8'
                // )
                // JSON.stringify(content)

                return `
          export const conf = {}
          export default conf
        `
            }
        }
    }
}
