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
    const configFile = interactConfig.paths.configFile;
    const layoutDirectory = `${interactConfig.paths.atDirectory}/layouts`;

    return {
        name: 'interact-conf-watch',

        configureServer(server) {

            server.watcher.add(configFile)
            server.watcher.add(layoutDirectory)
            console.log(`Watching the Interact configuration file ${configFile}`)
            server.watcher.on('change', async (file) => {

                if (!file.endsWith(configFile)) return

                await setGlobalsConf(configFile, true) // Set the globals again
                console.log("Interact configuration changed, restarting the http server.")
                console.log("Note that the init server configurations have not changed. If it does not work, stop and execute the start command again")
                server.restart().then(() => console.log("Interact configuration changed, dev server restarted"));

            })
            /**
             * Layouts are scanned and added to the configuration at start time
             */
            server.watcher.on("add", async (file) => {
                if (!file.startsWith(layoutDirectory)) return
                await setGlobalsConf(configFile, true) // Set the globals again
                console.log(`A new layout was added. Layout ${file} added to ${layoutDirectory}. Restarting`)
                server.restart().then(() => console.log("Layout added, dev server restarted"));
            })
            server.watcher.on("unlink", async (file) => {
                if (!file.startsWith(layoutDirectory)) return
                await setGlobalsConf(configFile, true) // Set the globals again
                console.log(`A layout was deleted. Layout ${file} deleted from ${layoutDirectory}. Restarting`)
                server.restart().then(() => console.log("Layout deleted, dev server restarted"));
            })
        },


    }
}
