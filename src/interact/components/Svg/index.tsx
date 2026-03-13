/**
 * Based on
 * https://github.com/svg/svgo
 */

import {type SVGProps} from "react";
import {optimize, type Config} from "svgo";
import interactConfig from "interact:config";
import type {InteractConfig} from "../../config/configHandler.js";
import {readFile} from "node:fs/promises";

/**
 * Otherwise we don't get any TypeScript error
 */
let interactConfigTyped = interactConfig as InteractConfig;


interface SvgComponentProps extends SVGProps<SVGSVGElement> {
    /** SVG file path from the img directory */
    src: string;
    /** Optional SVGR config overrides */
    svgoOptions?: Config
}


function spanElementError(error: string) {
    return (
        <span
            role="img"
            aria-label="SVG error"
            title={error ? "Unknown error" : String(error)}
            style={{color: "red", fontSize: 12}}
        >
        ⚠ SVG error
      </span>);
}

export default async function Svg({
                                       src,
                                       svgoOptions,
                                       ...svgProps
                                   }: SvgComponentProps) {


    try {

        const svgFile = interactConfigTyped.paths.imagesDirectory + "/" + src;
        const svgCode = await readFile(svgFile, "utf-8");
        // https://svgo.dev/docs/preset-default/
        // https://svgo.dev/docs/plugins/
        const {data: optimisedSvg} = optimize(svgCode, {
            plugins: [
                {name: "removeViewBox", active: false},   // keep viewBox
                {name: "removeDimensions", active: true},  // strip width/height attrs
            ],
            ...((svgoOptions as any)?.svgoConfig ?? {}),
        });

        // 2. Pull the outer <svg> attributes and inner content apart so we can
        //    render the element ourselves and forward any extra props cleanly.
        const match = optimisedSvg.match(/<svg([^>]*)>([\s\S]*?)<\/svg>\s*$/i);
        if (!match) {
            return spanElementError(`SvgComponent: failed to parse SVG source in ${src}`);
        }

        const [, rawAttrs, innerContent] = match;
        if (innerContent == null) {
            return spanElementError(`SvgComponent: no svg content found in ${src}`);
        }

        // Extract the attributes we want to preserve from the original SVG tag.
        let viewBox
        let xmlns
        if (rawAttrs != null) {
            viewBox = rawAttrs.match(/viewBox="([^"]*)"/)?.[1];
            xmlns = rawAttrs.match(/xmlns="([^"]*)"/)?.[1] ?? "http://www.w3.org/2000/svg";
        }

        // 3. Render as a plain <svg> RSC — no client bundle, no hydration.
        //    Caller props (width, height, fill, className, etc.) override defaults.
        return (
            <svg
                xmlns={xmlns}
                viewBox={viewBox}
                aria-hidden="true"
                {...svgProps}
                // Safe: source is always a file from the server's own filesystem.
                dangerouslySetInnerHTML={{__html: innerContent}}
            />
        );

    } catch (error) {

        return spanElementError(`Svg Component: an unexpected error occurred on the file ${src}. Error: ${error}`);
    }


}



