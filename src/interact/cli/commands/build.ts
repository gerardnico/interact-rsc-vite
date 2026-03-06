import {Command, Flags} from '@oclif/core'
import {createBuilder} from 'vite'
import {resolveInteractConfig} from "../utils/config";

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
            const builder = await createBuilder(resolveInteractConfig({rootPath, port: 5173}))
            console.log(Object.keys(builder.environments))
            // build App will call the environment in order and is equivalent to:
            //   await builder.build(builder.environments.rsc)
            //   await builder.build(builder.environments.ssr)
            //   await builder.build(builder.environments.client)
            // It will also call the buildApp Hook needed for static root
            await builder.buildApp();
            this.log('Build completed successfully!')
        } catch (error) {
            console.error(error)          // prints message
            console.error((error as Error).stack)    // prints stack
            this.error(`Build failed: ${error}`)
        }
    }
}