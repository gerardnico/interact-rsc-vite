/**
 * An attempt to use pagefind search on node
 * It works, but you need to import/load the bundle each time
 */
import path from "node:path";
import type {PagefindInstance} from "./pagefind-search";

import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";

/**
 * Node's fetch() doesn't support file://, yet
 */
const nativeFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
    const url = new URL(input.toString());

    if (url.protocol === "file:") {
        return new Response(
            await readFile(fileURLToPath(url)),
            {
                status: 200,
            },
        );
    }

    return nativeFetch(input, init);
};

// Point directly at the generated bundle on disk
const bundlePath = path.resolve("./sites/interact/.interact/html-cache/.interact/search");
const pagefindNode: PagefindInstance = await import(`file://${bundlePath}/pagefind.js`);


// noinspection UnnecessaryLocalVariableJS
/**
 * basePath from where the metadata are loaded
 * (We may use that to load different index)
 * Check loadEntry in the pagefind.js bundle
 */
const basePath = bundlePath;
await pagefindNode.options({
    basePath: `file://${basePath}/`,
    noWorker: true
});

/**
 * Load the data, index
 * found in the pagefind-entry.json file (hard coded)
 */
await pagefindNode.init();

const search = await pagefindNode.search("getting started", {
    verbose: true
});
const results = await Promise.all(
    search.results.slice(0, 10).map(r => r.data())
);

console.log(results);
