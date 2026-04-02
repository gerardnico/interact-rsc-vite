import {
    createMarkdownConfig,
    setMarkdownConfigGlobally
} from "../markdown/conf/markdownConfig.js";
import {createInteractConfig} from "../config/interactConfigHandler.js";
import {type InteractConfig, setInteractConfigGlobally} from "../config/interactConfig.js";

/**
 * This is used:
 * * in a vite config to set the configuration globally before start
 * * in a vite plugin to reset it before restarting the server
 *
 * Globals Conf are set and reused in each plugin
 * Why? If they change, we set them again, and we restart the dev server
 * No need to restart the process (difficult to do programmatically)
 */
export async function setGlobalsConf(confPath: string | undefined = undefined, force: boolean = false): Promise<InteractConfig> {
    const interactConfigTyped = createInteractConfig(confPath);
    setInteractConfigGlobally(interactConfigTyped, force);
    const markdownConfig = await createMarkdownConfig()
    setMarkdownConfigGlobally(markdownConfig, force)
    return interactConfigTyped;
}