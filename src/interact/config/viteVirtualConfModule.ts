import type {Plugin} from "vite";
import {interactConfigFilePath} from "./index.js";


export default function ConfVirtualModulePlugin(): Plugin {


    const watchedFile = interactConfigFilePath;

    return {
        name: 'interact-conf-module',


        configureServer(server) {

            server.watcher.add(watchedFile)

            server.watcher.on('change', (file) => {
                if (!file.endsWith(watchedFile)) return

                // trigger HMR update
                server.ws.send({
                    type: 'full-reload',
                })

            })
        },


    }
}
