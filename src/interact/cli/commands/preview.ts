
import {Command, Flags} from '@oclif/core'
import {createLogger, preview} from 'vite'
import {resolveViteConfig} from "../utils/cliConfigUtil.js";
import pc from "picocolors"

export default class Build extends Command {
    static description = 'Preview the static build'

    static flags = {
        root: Flags.string({
            description: 'Project root directory',
            default: process.cwd(),
        }),
    }

    async run(): Promise<void> {
        const {flags} = await this.parse(Build)

        const rootPath = flags.root

        try {
            const server = await preview(resolveViteConfig({rootPath, command:"preview"}));
            server.printUrls();
            server.bindCLIShortcuts({ print: true });
        } catch (e) {
            let error = e as Error;
            createLogger('error').error(pc.red(`error when starting preview server:\n${error.stack}`), { error: error });
            process.exit(1);
        }
    }
}