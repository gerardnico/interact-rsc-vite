/**
 * Navbar.
 * How it works, the container is a flex
 * In mobile screen, the label are pushed to the next line
 * via a flex grow
 */
import {getInteractConfig} from "@combostrap/interact/config";
import Image from "../Image/index.js"
import type {ContextProps} from "@combostrap/interact/types";
import React from "react";
import {cn} from "../../styling/cnUtil.js";
import {NavBarToggle} from "./NavbarToggle.js";
import Icon from "../Icon/index.js";

export type NavBarProps = React.HtmlHTMLAttributes<HTMLHtmlElement> & ContextProps;

// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function NavBar({request, page, className, ...props}: NavBarProps) {


    const interactConfig = getInteractConfig();
    let homeUrl = interactConfig.site.base

    // Determine if the image is an SVG based on the file extension
    let logoSrc: string | undefined;
    let logoAlt: string | undefined;
    let logoClass: string | undefined;
    let navBarConfig = interactConfig.components.NavBar;
    logoSrc = navBarConfig?.props?.logoSrc;
    let logo;
    if (logoSrc != null) {
        if (interactConfig.site.base != "/") {
            logoSrc = `${interactConfig.site.base}${logoSrc}`
        } else {
            logoSrc = `${logoSrc}`
        }
        const isSvg = logoSrc.endsWith('.svg');
        logoClass = "align-middle"
        logoAlt = navBarConfig?.props?.logoAlt;
        if (typeof logoAlt == 'undefined') {
            logoAlt = interactConfig.site.name;
        }
        let imageProps = {
            src: logoSrc,
            alt: logoAlt,
            className: logoClass,
            width: navBarConfig?.props?.logoWidth || 24,
            height: navBarConfig?.props?.logoHeight || 24
        }
        if (isSvg) {
            logo = <Icon {...imageProps} />
        } else {
            logo = <Image {...imageProps}/>
        }

    }
    const containerClass = interactConfig.style.container.containerClass
    // pb-0 is for the alignment with the brand text and logo
    const elementClass= "flex py-1 text-primary-700 no-underline pb-0"
    return (
        <header className={cn(className, "print:hidden")} {...props}>
            <nav className="border-b border-gray-200 px-4 py-2">
                <div className={cn(containerClass, "flex items-center justify-between md:flex-nowrap flex-wrap gap-4")}>
                    {/* Brand - flex because otherwise, the brand name goes next line */}
                    <a className="link-primary flex no-underline"
                       href={homeUrl}
                       title={logoAlt}
                       accessKey="h" style={{fontWeight: 700}}>
                        {logo}
                        {navBarConfig?.props?.brandName != null &&
                            <span
                                className="text-xl font-semibold text-primary">{navBarConfig?.props?.brandName}</span>}
                    </a>

                    {/* Toggle (in another component because it is a client component and that's forbidden in a layout component) */}
                    <NavBarToggle>
                        <a href="#" className={elementClass}>Todo</a>
                        <a href="#" className={elementClass}>Todo</a>
                        <a href="#" className={elementClass}>Todo</a>
                    </NavBarToggle>
                </div>
            </nav>
        </header>
    )
}