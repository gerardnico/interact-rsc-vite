import type {Plugin} from "vite";
import {
    getInteractConfig
} from "../config/interactConfig.js";
import {setGlobalsConf} from "./globalConf.js";

/**
 * Reload on config change
 */
export default function confWatcher(): Plugin {

    let interactConfig = getInteractConfig()
    const configFile = interactConfig.paths.configFile;
    const layoutDirectory = interactConfig.paths.layoutsDirectory;
    const markdownDirectory = interactConfig.paths.mdComponentsDirectory;

    return {
        name: 'interact:conf-watcher',

        configureServer(server) {

            server.watcher.add(configFile)
            server.watcher.add(layoutDirectory)
            server.watcher.add(markdownDirectory)
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
                if (!file.startsWith(layoutDirectory) || !file.startsWith(markdownDirectory)) return
                await setGlobalsConf(configFile, true) // Set the globals again
                console.log(`A component was added. ${file} added. Restarting`)
                server.restart().then(() => console.log("Dev server restarted"));
            })
            server.watcher.on("unlink", async (file) => {
                if (!file.startsWith(layoutDirectory) || !file.startsWith(markdownDirectory)) return
                await setGlobalsConf(configFile, true) // Set the globals again
                console.log(`A component was deleted. ${file} deleted. Restarting`)
                server.restart().then(() => console.log("Dev server restarted"));
            })
        },


    }
}
