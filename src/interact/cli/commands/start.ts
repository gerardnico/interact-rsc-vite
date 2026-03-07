// https://github.com/altano/npm-packages/blob/main/packages/remark-mdx-toc-with-slugs/src/index.ts
import path from "node:path";
import {Command, Flags} from '@oclif/core'
import {createServer} from 'vite'


export default class Start extends Command {
    static description = 'Start Development server'

    static flags = {
        root: Flags.string({
            description: 'Project root directory',
            default: process.cwd(),
        }),
        port: Flags.integer({
            description: 'Dev server port',
            default: 5173,
        }),
    }

    async run(): Promise<void> {
        const {flags} = await this.parse(Start)

        /**
         * Eager injection of root path to be used by the interact config module
         * before init
         */
        let rootPath = path.resolve(flags.root)
        process.env.INTERACT_ROOT_PATH = rootPath
        /**
         * If on top of the file, it's loaded in dev
         * https://github.com/oclif/core/issues/997
         */
        const { resolveViteConfig } = await import("../shared/viteConfig.js");

        let viteConfig = resolveViteConfig({rootPath, port: flags.port, command: "start"});
        const server = await createServer(viteConfig);
        await server.listen()
        // port may change
        // ie Port 5173 is in use, trying another one...
        this.log(`Starting Interact Dev server`)
        server.printUrls()

        // keep process alive + graceful shutdown
        const shutdown = async () => {
            this.log('\nShutting down Interact Dev server...')
            await server.close()
            process.exit(0)
        }

        process.on('SIGINT', shutdown)
        process.on('SIGTERM', shutdown)
    }
}