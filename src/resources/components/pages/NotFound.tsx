// noinspection JSUnusedGlobalSymbols - imported dynamically

import {getInteractConfig} from "../../../interact/config/interactConfig.js";

export const frontmatter = {
    "layout": "hamburger",
    "title": "Not Found"
}

export default function NotFound({url}: { url: URL }) {


    return <p>Error: The page {url.pathname} was not found {getInteractConfig().site.base}</p>

}