import type {Plugin} from 'vite';
import {getInteractConfig} from "../config/interactConfig.js";
import {existsSync} from "fs";
import path, {dirname} from "path";
import {fileURLToPath} from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function viteStylingGlobalStylesheet(): Plugin {
    // The .css extension on the virtual module ID is the key — it tells Vite to handle the returned string as a CSS stylesheet rather than JavaScript.
    const moduleId = "interact:global.css"
    //const resolvedId = "\0" + moduleId
    const resolvedId = moduleId;
    let interactConfig = getInteractConfig()
    let filePath = interactConfig.paths.cssFile
    if (!existsSync(filePath)) {
        filePath = path.resolve(__dirname, "global.css");
    }
    if (!existsSync(filePath)) {
        throw new Error("A global css file should have been found");
    }

    return {
        name: moduleId,
        resolveId(id) {
            // file path is mandatory, we don't load the content in the load function
            // because the path in the file are relative to the file
            // This is equivalent to a redirect
            if (id === resolvedId) return filePath
        },
        configureServer(server) {

            server.watcher.add(filePath)
            server.watcher.on('change', (file) => {

                if (!file.endsWith(filePath)) return

                // trigger HMR update
                // full refresh, no?
                server.ws.send({type: 'full-reload'})

            })
            server.watcher.on('delete', (file) => {

                if (!file.endsWith(filePath)) return

                // trigger HMR update
                // full refresh, no?
                server.restart().then(() => console.log(`The server was restarted because the styling file (${filePath}) was deleted`));

            })
        },
    }
}