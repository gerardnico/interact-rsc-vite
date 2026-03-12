// https://github.com/altano/npm-packages/blob/main/packages/remark-mdx-toc-with-slugs/src/index.ts
import {Flags} from '@oclif/core'
import {createServer} from 'vite'
import {resolveViteConfig} from "../shared/vite.config.js";
import {BaseCommand} from "../baseCommand.js";


export default class Start extends BaseCommand<typeof Start> {
    static description = 'Start Development server'

    static flags = {
        port: Flags.integer({
            description: 'Dev server port',
            default: 5173,
        }),
    }

    async run(): Promise<void> {
        const {flags} = await this.parse(Start)

        let viteConfig = await resolveViteConfig({
            confPath: flags.confPath,
            port: flags.port,
            outDir: flags.outDir,
            logLevel: flags.logLevel,
            command: "start",
        });
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