import {type SVGProps} from "react";
import {optimize, type Config} from "svgo";
import {getInteractConfig} from "@combostrap/interact/config";
import {readFile} from "node:fs/promises";
import favicon from "../../images/letter-i-3-colors.svg?raw"
import {cn} from "@/lib/utils";

export type SvgComponentProps = SVGProps<SVGSVGElement> & {
    /** SVG file path from the img directory */
    src: string;
    /** Optional SVGR config overrides */
    svgoOptions?: Config
}

function rawAttrToReact(attrString:string|undefined) {

    const result:Record<string, any> = {};
    if (attrString == null){
        return result;
    }
    const regex = /(\w[\w-]*)="([^"]*)"/g;
    for (const [, key, value] of attrString.matchAll(regex)) {
        if (key==null){
            continue;
        }
        const reactKey = key === 'class' ? 'className'
            : key === 'for' ? 'htmlFor'
                : key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        result[reactKey] = value;
    }
    return result;
}

function spanElementError(error: string, label: string = "SVG error") {
    return (
        <span
            role="img"
            aria-label={label}
            title={error}
            style={{color: "red", fontSize: 12}}
        >
        ⚠ {label}
      </span>);
}

/**
 * This is a server only component as it needs to read the svg file
 * Optimized with https://github.com/svg/svgo
 */
export default async function Svg({
                                      src,
                                      svgoOptions,
                                      ...svgProps
                                  }: SvgComponentProps) {


    try {
        if (src.startsWith("/")) {
            src = src.slice(1);
        }
        let interactConfig = getInteractConfig();
        const svgFile = interactConfig.paths.imagesDirectory + "/" + src;
        let svgCode
        try {
            svgCode = await readFile(svgFile, "utf-8");
        } catch (error) {
            const err = error as NodeJS.ErrnoException;
            if (err.code !== "ENOENT") {
                return spanElementError(String(error), `Unknown error`);
            }
            if (src != "favicon.svg") {

                return spanElementError(String(error), `${src} not found`);
            }
            svgCode = favicon;
        }
        let defaultSvgoConfig = interactConfig.svg.svgo;
        const {data: optimisedSvg} = optimize(svgCode, {
            ...((svgoOptions as any)?.svgoConfig ?? defaultSvgoConfig),
        });

        // Pull the outer <svg> attributes and inner content apart
        const match = optimisedSvg.match(/<svg([^>]*)>([\s\S]*?)<\/svg>\s*$/i);
        if (!match) {
            return spanElementError(`SvgComponent: failed to parse SVG source in ${src}`, 'Bad Svg Syntax');
        }

        const [, rawSvgRootAttrs, rawInnerContent] = match;
        if (rawInnerContent == null) {
            return spanElementError(`SvgComponent: no svg content found in ${src}`, 'No content');
        }

        // Transform the svg root attributes string in react attributes
        let reactRawAttrs = rawAttrToReact(rawSvgRootAttrs);

        return (
            <svg
                {...reactRawAttrs}
                {...svgProps}
                className={cn(reactRawAttrs['className'],svgProps['className'])}
                // Safe: source is always a file from the server's own filesystem.
                dangerouslySetInnerHTML={{__html: rawInnerContent}}
            />
        );

    } catch (error) {
        return spanElementError(`Svg Component: an unexpected error occurred on the file ${src}. Error: ${error}`);
    }


}



