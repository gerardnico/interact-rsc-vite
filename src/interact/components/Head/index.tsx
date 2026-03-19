import type {TemplateProps} from "../../types/index.js";
import {PAGE_CONTAINER} from "../classNames.js";
import type {FaviconSetSchemaType} from "../../config/configSchema.js";
import {getInteractConfig} from "@combostrap/interact/config";
import React from "react";

export type HeadProps = React.HTMLAttributes<HTMLHeadElement> & TemplateProps;

// noinspection JSUnusedGlobalSymbols - imported via package.json export
export default function Head({page, request, ...props}: HeadProps) {

    let frontmatter = page?.frontmatter;
    let title = frontmatter?.title;
    let description = frontmatter?.description;
    let keyWords = frontmatter?.keyWords;
    let robots = frontmatter?.robots;
    /**
     * Last modified
     */
    let lastModified;
    if (frontmatter?.lastModified != null) {
        lastModified = new Date(frontmatter.lastModified);
    }
    const interactConfig = getInteractConfig();
    const primary = interactConfig.site.colorPrimary

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
    let containerMaxWidth = interactConfig.style.container.containerMaxWidth;
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
    const base = interactConfig.site.base
    const isBrowserPathRoot = url.pathname === base;
    let headPageTitle = title ? title : "";
    if (!headPageTitle && isBrowserPathRoot) {
        headPageTitle = interactConfig.site.title || 'Default'
    }
    let pageTitle = headPageTitle + " | " + interactConfig.site.name

    /**
     * Head base meta
     * Relative path and anchor links in the page are
     * calculated by the browser relative to the path name of this URL
     *
     * In the root, we need to add a slash otherwise the relative path is calculated
     * against the parent path (if there is a base, there is another parent)
     *
     * ie <base href="/reference/component/">
     * works across domains because it's domain-agnostic — it always resolves relative to wherever the site is hosted.
     */
    let baseHeadURL = (interactConfig.site.base != "/" ? interactConfig.site.base : "") + url.pathname;
    /**
     * The below IF got deleted when a production build is done
     */
    if (import.meta.env.MODE == "production") {
        if (interactConfig.site.url != null) {
            baseHeadURL = interactConfig.site.url + baseHeadURL
        }
    }


    return (
        <head {...props}>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>{pageTitle}</title>
            <meta name="generator" content="Interact"/>
            {/* Rendered at: */}
            <meta name="date" content={new Date().toISOString()}/>
            {/* Last modified*/}
            {lastModified && (<meta httpEquiv="last-modified" content={lastModified.toUTCString()}/>)}
            {/* Base */}
            <base href={baseHeadURL}/>
            {description && <meta name="description" content={description}/>}
            {interactConfig.site.favicons && Object.entries(interactConfig.site.favicons as FaviconSetSchemaType).map(([faviconPath, faviconProperties], index) => {
                if (!faviconProperties) {
                    return;
                }
                return (
                    <link key={index}
                          rel={faviconProperties.rel}
                          href={faviconProperties.image?.href ? faviconProperties.image.href : `/${faviconPath}`}
                          type={faviconProperties.image?.type}
                          sizes={faviconProperties.image?.width && faviconProperties.image?.height ? `${faviconProperties.image.width}x${faviconProperties.image.height}` : ''}
                    />
                )
            })}
            {interactConfig.site.colorPrimary &&
                <meta name="theme-color" content={interactConfig.site.colorPrimary}/>}
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