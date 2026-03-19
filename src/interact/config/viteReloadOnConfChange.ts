import type {Plugin} from "vite";
import {type InteractConfig} from "./interactConfig.js";

/**
 * Reload on config change
 */
export default function viteReloadOnConfChange(interactConfig: InteractConfig): Plugin {

    const watchedFile = interactConfig.paths.configFile;

    return {
        name: 'interact-conf-watch',

        configureServer(server) {

            server.watcher.add(watchedFile)

            server.watcher.on('change', (file) => {

                if (!file.endsWith(watchedFile)) return

                // trigger HMR update
                // full refresh, no?
                server.ws.send({type: 'full-reload'})

            })
        },


    }
}
