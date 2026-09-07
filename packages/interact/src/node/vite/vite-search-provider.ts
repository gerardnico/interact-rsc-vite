import type {Plugin} from 'vite';
import {getInteractConfig} from "../config/interactConfig.js";
import path from "node:path";

export default function viteSearchProvider(): Plugin {

    const moduleName = 'interact:search-provider';
    const interactConfig = getInteractConfig()

    return {
        name: moduleName,
        resolveId(id: string) {
            if (id !== moduleName) return;
            return path.resolve(interactConfig.paths.interactResourcesDirectory, 'search/pagefind/pagefind-browser.ts');
        }
    };
}