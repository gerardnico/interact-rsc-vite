import {Command, Flags} from '@oclif/core'
import {createBuilder, createLogger} from 'vite'
import {resolveViteConfig} from "../utils/cliConfigUtil";
import pc from "picocolors";

export default class Build extends Command {
    static description = 'Build project for production'

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
            const builder = await createBuilder(resolveViteConfig({rootPath, command:'build'}))
            console.log(Object.keys(builder.environments))
            // build App will call the environment in order and is equivalent to:
            //   await builder.build(builder.environments.rsc)
            //   await builder.build(builder.environments.ssr)
            //   await builder.build(builder.environments.client)
            // and calling the buildApp Hook (static generation uses this hook)
            await builder.buildApp();
            this.log('Build completed successfully!')
        } catch (e) {
            let error = e as Error;
            createLogger('error').error(pc.red(`error when building:\n${error.stack}`), {error: error});
            process.exit(1);
        }
    }
}