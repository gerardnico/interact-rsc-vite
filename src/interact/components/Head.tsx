import type {ContextProps} from "../types/index.js";
import {PAGE_CONTAINER_CLASS_NAME} from "./classNames.js";
import {getInteractConfig} from "@combostrap/interact/config";
import React from "react";

export type HeadProps = React.HTMLAttributes<HTMLHeadElement> & ContextProps;

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

    /**
     * Layout
     */
    let containerMaxWidth = interactConfig.style.container.containerMaxWidth;
    let layoutStyle;
    if (containerMaxWidth != undefined) {
        layoutStyle = `
.${PAGE_CONTAINER_CLASS_NAME} {
   max-width: ${containerMaxWidth}
}
`
    }

    /**
     * Page Title
     */
    const url = new URL(request.url);
    const base = interactConfig.site.base
    const isBrowserPathRoot = url.pathname === base || url.pathname === `${base}index`;
    let headPageTitle = title ? title : "";
    if (!headPageTitle && isBrowserPathRoot) {
        headPageTitle = interactConfig.site.title || 'Default'
    }
    let pageTitle = headPageTitle + (!isBrowserPathRoot ? " | " + interactConfig.site.name : "")

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
            {interactConfig.site.favicons && Object.entries(interactConfig.site.favicons).map(([faviconPath, faviconProperties], index) => {
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
            {interactConfig.site.manifest && <link rel="manifest" href={interactConfig.site.manifest}/>}
            {interactConfig.site.colorPrimary &&
                <meta name="theme-color" content={interactConfig.site.colorPrimary}/>}
            <meta name="robots" content={robots ? robots : "index, follow"}/>
            {keyWords && <meta name="keywords" content={keyWords}/>}
            {layoutStyle && (<style dangerouslySetInnerHTML={{__html: layoutStyle}}/>)}
        </head>
    )
}