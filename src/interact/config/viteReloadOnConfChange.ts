import type {Plugin} from "vite";
import {
    getInteractConfig
} from "./interactConfig.js";
import {setGlobalsConf} from "../cli/shared/vite.config.js";

/**
 * Reload on config change
 */
export default function viteReloadOnConfChange(): Plugin {

    let interactConfig = getInteractConfig()
    const watchedFile = interactConfig.paths.configFile;

    return {
        name: 'interact-conf-watch',

        configureServer(server) {

            server.watcher.add(watchedFile)
            console.log(`Watching the Interact configuration file ${watchedFile}`)
            server.watcher.on('change', async (file) => {

                if (!file.endsWith(watchedFile)) return

                /**
                 * Set the globals again
                 */
                await setGlobalsConf(watchedFile, true)

                console.log("Interact configuration changed, restarting the http server.")
                console.log("Note that the init server configurations have not changed. If it does not work, stop and execute the start command again")
                server.restart().then(() => console.log("Interact configuration changed, dev server restarted"));

            })
        },


    }
}
