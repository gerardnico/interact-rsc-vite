import {Args, Command, Flags} from '@oclif/core'
import * as path from "path";
import * as fs from "fs";

import {
    type FaviconSettings,
    type MasterIcon,
    generateFaviconFiles,
    IconTransformationType
} from '@realfavicongenerator/generate-favicon';
import {getNodeImageAdapter, loadAndConvertToSvg} from "@realfavicongenerator/image-adapter-node";
import config from "../../config";

async function generateImage({masterFilePath, dryRun, outputDirectory}: {
    masterFilePath?: string,
    dryRun: boolean,
    outputDirectory: string
}) {
    if (!masterFilePath) {
        masterFilePath = config.theme.site.masterFavicon
    }
    console.log(`Generating Favicons and Manifest with the master file: ${masterFilePath}`)

    const imageAdapter = await getNodeImageAdapter();

    // This is the icon that will be transformed into the various favicon files
    const masterIcon: MasterIcon = {
        icon: await loadAndConvertToSvg(masterFilePath),
    }

    const faviconSettings: FaviconSettings = {
        icon: {
            desktop: {
                regularIconTransformation: {
                    type: IconTransformationType.None,
                    backgroundRadius: 0,
                    backgroundColor: "#ffffff",
                    imageScale: 0.7,
                    brightness: 1
                },
                darkIconType: "none",
                // @ts-ignore
                darkIconTransformation: null
            },
            touch: {
                transformation: {
                    type: IconTransformationType.Background,
                    backgroundRadius: 0,
                    backgroundColor: "#ffffff",
                    imageScale: 0.7,
                    brightness: 1
                },
                appTitle: config.theme.site.name
            },
            webAppManifest: {
                transformation: {
                    type: IconTransformationType.Background,
                    backgroundColor: "#ffffff",
                    backgroundRadius: 0,
                    imageScale: 0.6,
                    brightness: 1
                },
                backgroundColor: "#ffffff",
                name: config.theme.site.title,
                shortName: config.theme.site.name,
                themeColor: config.theme.colors.primary
            }
        },
        path: "/",
    };


    const files = await generateFaviconFiles(masterIcon, faviconSettings, imageAdapter);
    if (dryRun) {
        console.log(`DryRun: The following files would have been created:`);
    } else {
        console.log(`The following files have been created:`);
    }
    let absoluteMasterFilePath = path.resolve(masterFilePath)
    for (const [filename, content] of Object.entries(files)) {

        const targetFilePath: string = path.join(outputDirectory, filename);

        if (path.resolve(targetFilePath) === absoluteMasterFilePath) {
            console.log(`- ${targetFilePath} (Skipped: We don't overwrite the master file)`);
            continue
        }

        if (!dryRun) {
            const dir: string = path.dirname(targetFilePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {recursive: true});
            }

            if (typeof content === "string") {
                fs.writeFileSync(targetFilePath, content, "utf-8");
            } else if (Buffer.isBuffer(content)) {
                fs.writeFileSync(targetFilePath, Uint8Array.from(content));
            } else {
                throw new Error(
                    `Blob content for "${filename}" cannot be handled synchronously. Convert to Buffer before passing in.`
                );
            }
        }
        console.log(`- ${targetFilePath}`);


    }
}


export default class GenerateFavicon extends Command {
    static description = 'Generate the favicons and app manifest from a master icon file'

    static examples = [
        '<%= config.bin %> <%= command.id %> path/to/master-icon.svg',
    ]
    static flags = {
        dryRun: Flags.boolean({
            aliases: ["dr"],
            description: "Don't create the files",
            default: false,
        }),
        outputDirectory: Flags.string({
            aliases: ["o"],
            description: "The output directory (default to the public directory)",
            default: "public"
        })
    }
    static args = {
        filePath: Args.string({
            name: 'masterSvgFilePath',
            description: 'Path to the master svg file',
        })
    }

    async run(): Promise<void> {
        const {args, flags} = await this.parse(GenerateFavicon)

        const filePath = args.filePath
        const dryRun = flags.dryRun
        const outputDirectory = flags.outputDirectory
        await generateImage({masterFilePath: filePath, dryRun, outputDirectory})
    }
}