import * as path from "path";
import * as fs from "fs";

import type {FaviconSettings, MasterIcon} from '@realfavicongenerator/generate-favicon';
import {generateFaviconFiles, IconTransformationType, stringToSvg} from '@realfavicongenerator/generate-favicon';
import {getNodeImageAdapter} from "@realfavicongenerator/image-adapter-node";
import type {InteractConfig} from "@combostrap/interact/types";
// interactConfig should be relative path and not the package.json export as this is used by the client
import {createInteractConfig} from "../../config/interactConfigHandler.js";

export interface FaviconActionOptions {
    confPath?: string;
    filePath?: string;
    dryRun?: boolean;
    outputDirectory?: string;
}

async function generateImage({masterFilePath, dryRun, outputDirectory, interactConfig: config}: {
    masterFilePath: string,
    dryRun: boolean,
    outputDirectory: string
    interactConfig: InteractConfig
}) {

    console.log(`Generating Favicons and Manifest with the master file: ${masterFilePath}`)
    if (!fs.existsSync(masterFilePath)) {
        console.error(`The file ${masterFilePath} does not exist.`);
        process.exit(1);
    }

    console.log(`  * Getting image adapter`)
    const imageAdapter = await getNodeImageAdapter();

    // This is the icon that will be transformed into the various favicon files
    console.log(`  * Loading master icon file`)
    const content = fs.readFileSync(masterFilePath, 'utf8');
    const svg = stringToSvg(content, imageAdapter);

    const masterIcon: MasterIcon = {icon: svg}

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
                // @ts-expect-error
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
                appTitle: config.site.name
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
                name: config.site.title,
                shortName: config.site.name,
                themeColor: config.site.colorPrimary
            }
        },
        imageDirectory: "/",
        path: config.site.base
    };

    console.log(`  * Generating favicons files`);
    let files
    try {
        files = await generateFaviconFiles(masterIcon, faviconSettings, imageAdapter);
    } catch (e) {
        console.error(`Error while generating favicons file: ${e}`, e);
        process.exit(1);
    }
    if (dryRun) {
        console.log(`DryRun: The following files would have been created:`);
    } else {
        console.log(`The following files have been created:`);
    }
    const absoluteMasterFilePath = path.resolve(masterFilePath)
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

export async function favicon({
                                  confPath,
                                  filePath,
                                  dryRun = false,
                                  outputDirectory
                              }: FaviconActionOptions): Promise<void> {
    const interactConfigTyped = createInteractConfig(confPath);
    const masterFilePath = filePath || path.resolve(interactConfigTyped.paths.imagesDirectory, interactConfigTyped.site.favicon);
    const resolvedOutputDirectory = outputDirectory || interactConfigTyped.paths.publicDirectory
    await generateImage({
        interactConfig: interactConfigTyped,
        masterFilePath,
        dryRun,
        outputDirectory: resolvedOutputDirectory
    })
}
