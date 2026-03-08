import type {TemplateProps} from "../../types/index.js";
import {PAGE_CONTAINER} from "../classNames.js";
import type {FaviconSetSchemaType, InteractConfigType} from "../../config/configSchema.js";
import {interactConfig} from "interact:config";

/**
 * Otherwise we don't get any TypeScript error
 */
let interactConfigTyped = interactConfig as InteractConfigType;

export default function Head({pageModule, request}: TemplateProps) {

    let title = pageModule.frontmatter?.title;
    let description = pageModule.frontmatter?.description;
    let keyWords = pageModule.frontmatter?.keyWords;
    let robots = pageModule.frontmatter?.robots;

    const primary = interactConfigTyped.site.colorPrimary

    const hexToRgb = (hex: string) => {
        // @ts-ignore
        return hex
            .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1)
            .match(/.{2}/g)
            .map(x => parseInt(x, 16))
    }

    const primaryRgb = hexToRgb(primary);
    let style = `
:root {
    --bs-primary: ${primary};
    --bs-primary-rgb: ${primaryRgb};
    --bs-link-color: ${primary};
    --bs-link-color-rgb: ${primaryRgb};
    --bs-body-font-family: "Times New Roman", Times, serif";
}`
    let containerMaxWidth = interactConfigTyped.style.container.containerMaxWidth;
    if (containerMaxWidth != undefined) {
        style += `
.${PAGE_CONTAINER} {
   max-width: ${containerMaxWidth}
}
`
    }

    /**
     * Page Title
     */
    const url = new URL(request.url);
    const base = interactConfigTyped.site.base
    const isBrowserPathRoot = url.pathname === base;
    let headPageTitle = title ? title : "";
    if (!headPageTitle && isBrowserPathRoot) {
        headPageTitle = interactConfigTyped.site.title || 'Default'
    }
    let pageTitle = headPageTitle + " | " + interactConfigTyped.site.name

    /**
     * Head base meta
     * Relative path and anchor links in the page are
     * calculated by the browser relative to the path name of this URL
     */
    let baseHeadURL = request.url;
    const isDev = process.env['NODE_ENV'] === 'development';
    if (!isDev) {
        baseHeadURL = interactConfigTyped.site.url + url.pathname
    }
    if (isBrowserPathRoot) {
        /**
         * In the root, we need to add a slash otherwise the relative path is calculated
         * against the parent path (if there is a base, there is another parent)
         */
        baseHeadURL = `${base}/`;
    }
    return (
        <head>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>{pageTitle}</title>
            <meta name="generator" content="Interact"/>
            <base href={baseHeadURL}/>
            {description && <meta name="description" content={description}/>}
            {interactConfigTyped.site.favicons && Object.entries(interactConfigTyped.site.favicons as FaviconSetSchemaType).map(([faviconPath, faviconProperties]) => {
                if (!faviconProperties) {
                    return;
                }
                return (
                    <link
                        rel={faviconProperties.rel}
                        href={faviconProperties.image?.href ? faviconProperties.image.href : `/${faviconPath}`}
                        type={faviconProperties.image?.type}
                        sizes={faviconProperties.image?.width && faviconProperties.image?.height ? `${faviconProperties.image.width}x${faviconProperties.image.height}` : ''}
                    />
                )
            })}
            {interactConfigTyped.site.colorPrimary &&
                <meta name="theme-color" content={interactConfigTyped.site.colorPrimary}/>}
            <meta name="robots" content={robots ? robots : "index,follow"}/>
            {keyWords && <meta name="keywords" content={keyWords}/>}
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
                crossOrigin="anonymous"/>
            <link rel="stylesheet"
                  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"/>
            <style dangerouslySetInnerHTML={{__html: style}}/>
        </head>
    )
}