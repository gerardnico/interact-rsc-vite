import {createLogger, preview} from 'vite'
import pc from "picocolors"
import {resolveViteConfig} from "../shared/viteConfig.js";
import {BaseCommand} from "../baseCommand.js";

export default class Preview extends BaseCommand<typeof Preview> {
    static description = 'Preview the static build'


    async run(): Promise<void> {
        const {flags} = await this.parse(Preview)

        try {
            const server = await preview(resolveViteConfig({
                confPath: flags.confPath,
                logLevel: flags.logLevel,
                command: "preview"
            }));
            server.printUrls();
            server.bindCLIShortcuts({print: true});
        } catch (e) {
            let error = e as Error;
            createLogger('error').error(pc.red(`error when starting preview server:\n${error.stack}`), {error: error});
            process.exit(1);
        }
    }
}