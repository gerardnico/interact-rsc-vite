import type {LayoutProps} from "@combostrap/interact/types";
import {PAGE_CONTAINER_CLASS_NAME} from "../classNames.js";
import {getInteractConfig} from "@combostrap/interact/config";
import React from "react";

export type HeadProps = React.HTMLAttributes<HTMLHeadElement> & LayoutProps;

// noinspection JSUnusedGlobalSymbols - imported via package.json export
export default function Head({page, context, ...props}: HeadProps) {

    let frontmatter = page?.frontmatter;
    let title = frontmatter?.title;
    let description = frontmatter?.description;
    let keyWords = frontmatter?.keyWords;
    let robots = frontmatter?.robots;

    /**
     * Last modified
     */
    let lastModified;
    if (context.meta.lastModified != null) {
        lastModified = new Date(context.meta.lastModified);
    }
    const interactConfig = getInteractConfig();

    /**
     * Layout
     */
    let containerMaxWidth = interactConfig.template.container.containerMaxWidth;
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
    const base = interactConfig.site.base
    const isBrowserPathRoot = context.url.pathname === base || context.url.pathname === `${base}index`;
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
    let baseHeadURL = (interactConfig.site.base != "/" ? interactConfig.site.base : "") + context.url.pathname;

    /**
     * The markdown alternate version
     * (URL Path name should have already the base)
     */
    let markdownAlternateHref = context.url.pathname.endsWith("/") ? context.url.pathname + "index.md" : context.url.pathname + ".md"
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
            {page.headElements}
            <link rel="alternate" type="text/markdown" href={markdownAlternateHref}/>
        </head>
    )
}