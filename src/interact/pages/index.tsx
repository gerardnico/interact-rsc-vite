import fs from "fs";
import path from "path";

/**
 * Directory of all pages
 */
export let pagesDir = "./apps/app/pages"

// @ts-ignore
import * as Index from "../../../apps/app/pages/index.mdx"
// @ts-ignore
import * as Counter from "../../../apps/app/pages/counter.mdx"
// @ts-ignore
import * as Yolo from "../../../apps/app/pages/yolo/yolo.mdx"
import * as NotFound from "../layout/NotFound"
import Holy from "../layout/Holy";
import Landing from "../layout/Landing";

export interface PageFile {
    path: string;
    name: string;
}

export function getPagesRecursively(dir: string, startDir: string = dir): Record<string, PageFile> {
    const results: Record<string, PageFile> = {};

    function walk(currentDir: string): void {
        const entries = fs.readdirSync(currentDir, {withFileTypes: true});

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                walk(fullPath);
                continue
            }
            const ext = path.extname(entry.name);
            const withoutExt = ext ? fullPath.slice(0, -ext.length) : fullPath;
            const relativePath = path.relative(startDir, withoutExt);
            let keyPath = "/" + relativePath;
            results[keyPath] = {
                name: path.basename(relativePath),
                path: keyPath,
            };
        }
    }

    walk(dir);
    return results;
}

/**
 * The root component should return the entire document including the root <html> tag.
 * See https://react.dev/reference/react-dom/server/renderToReadableStream#usage
 */
export function getRootComponent(url: URL): React.JSX.Element {


    let module;
    switch (url.pathname) {
        case "/":
        case "/index":
            module = Index
            break
        case "/counter":
            module = Counter
            break
        case "/yolo/yolo":
            module = Yolo;
            break
        default:
            console.log("Not found: " + url.pathname)
            module = NotFound
            break
    }

    let frontmatter = module?.frontmatter as Record<string, string>;
    let layout = "holy"
    if (frontmatter) {
        let frontMatterLayout = frontmatter?.layout.toLowerCase();
        if (frontMatterLayout) {
            layout = frontMatterLayout
        }
    }

    let Layout
    switch (layout) {
        case "holy": {
            Layout = Holy
            break
        }
        case "landing": {
            Layout = Landing
            break;
        }
        default: {
            Layout = Holy;
            console.log("Layout not found: " + layout)
        }
    }

    return <Layout Component={module.default}/>

}

/**
 * We export it so that static rendering (SSG)
 * can use it to render each page
 */
export function getStaticPaths() {
    return Object.keys(getPagesRecursively(pagesDir))
}

export function getPages() {
    return getPagesRecursively(pagesDir)
}