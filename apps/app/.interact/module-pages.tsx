/**
 * Module Page are page created from JavaScript code (ie mdx or tsx)
 */
// @ts-ignore
import * as Index from "../pages/index.mdx";
// @ts-ignore
import * as Counter from "../pages/counter.mdx";
// @ts-ignore
import * as Yolo from "../pages/yolo/yolo.mdx";
import type {PageModule} from "../../../src/interact/types";

let modulePages: Record<string, PageModule> = {
    "/": Index,
    "/index": Index,
    "/counter": Counter,
    "/yolo/yolo": Yolo,
}

export default function getModulePage({path, notFoundPath}: {
    path: string,
    notFoundPath?: string
}): PageModule | undefined {
    let module = modulePages[path]
    if (module) {
        return module;
    }
    if (!notFoundPath) {
        return;
    }
    module = modulePages[notFoundPath]
    if (!module) {
        console.error("The configured NotFound page (" + notFoundPath + ") does not exist")
    }
    return module;
}