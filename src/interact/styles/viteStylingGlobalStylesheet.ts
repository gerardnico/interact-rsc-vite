import type {Plugin} from 'vite';
import {getInteractConfig} from "../config/interactConfig.js";
import {existsSync} from "fs";
import path from "path";


export default function viteStylingGlobalStylesheet(): Plugin {
    // The .css extension on the virtual module ID is the key — it tells Vite to handle the returned string as a CSS stylesheet rather than JavaScript.
    const moduleId = "interact:global.css"
    //const resolvedId = "\0" + moduleId
    const resolvedId = moduleId;
    let interactConfig = getInteractConfig()
    let confCssFilePath = interactConfig.paths.cssFile
    if (!existsSync(confCssFilePath)) {
        confCssFilePath = path.resolve(interactConfig.paths.resourcesDirectory, "styles", "global.css");
    }
    if (!existsSync(confCssFilePath)) {
        throw new Error(`A global CSS file should have been found`);
    }

    return {
        name: moduleId,
        resolveId(id) {
            // file path is mandatory, we don't load the content in the load function
            // because the path in the file are relative to the file
            // This is equivalent to a redirect
            if (id === resolvedId) return confCssFilePath
        },
        configureServer(server) {

            server.watcher.add(confCssFilePath)
            server.watcher.on('change', (file) => {

                if (!file.endsWith(confCssFilePath)) return

                // trigger HMR update
                // full refresh, no?
                server.ws.send({type: 'full-reload'})

            })
            server.watcher.on('delete', (file) => {

                if (!file.endsWith(confCssFilePath)) return

                // trigger HMR update
                // full refresh, no?
                server.restart().then(() => console.log(`The server was restarted because the styling file (${confCssFilePath}) was deleted`));

            })
        },
    }
}