
import {PAGE_CONTAINER} from "../classNames.js";
import interactConfig from "interact:config";
import Image from "../Image/index.js"
import type {TemplateProps} from "../../types/index.js";
import type {InteractConfigType} from "../../config/configHandler.js";

// @ts-ignore
export default function NavBar(props:TemplateProps) {

    /**
     * Otherwise TypeScript does not errored for unknown propertie
     */
    const interactConfigCasted = (interactConfig as InteractConfigType)

    let homeUrl = ""
    const isDev = process.env['NODE_ENV'] === 'development';
    if (isDev) {
        homeUrl = ""
    }
    if (homeUrl.endsWith("/")) {
        // normalization
        // because a click on http://localhost//hallo
        // goes to http://localhost
        homeUrl = homeUrl.slice(0, homeUrl.length - 1)
    }
    let siteBase = interactConfigCasted.site.base;

    if (siteBase) {
        homeUrl = `${homeUrl}${siteBase}`
    }

// logo if svg
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7611f7" data-name="logo" width="30" height="30" class="svg-cs d-inline-block align-text-top svg-icon-cs">

// Determine if the image is an SVG based on the file extension
    let logoSrc: string | undefined;
    let logoAlt: string | undefined;
    let logoClass: string | undefined;
    let navBarConfig = interactConfigCasted.components.NavBar;
    logoSrc = navBarConfig?.props?.logoSrc;
    if (typeof logoSrc != 'undefined') {
        const isSvg = logoSrc.endsWith('.svg');
        logoClass = "d-inline-block align-text-top"
        if (isSvg) {
            logoClass += "svg-cs svg-icon-cs"
        }
        logoAlt = navBarConfig?.props?.logoAlt;
        if (typeof logoAlt == 'undefined') {
            logoAlt = interactConfigCasted.site.name;
        }

        if (siteBase) {
            let logoPathSep = "";
            if (!logoSrc.startsWith("/")) {
                logoPathSep = "/"
            }
            logoSrc = `${siteBase}${logoPathSep}${logoSrc}`
        }
    }
    const containerClass = interactConfigCasted.style.container.containerClass
    return (
        <header id="page-header" className="d-print-none">
            <nav className="navbar navbar-expand-md navbar-light" data-type="fixed-top"
                 style={{backgroundColor: "var(--bs-light)"}}>
                <div className={PAGE_CONTAINER + " " + containerClass}>
                    <a className="link-primary navbar-brand"
                       href={homeUrl} title={interactConfigCasted.site.title}
                       accessKey="h" style={{fontWeight:700}}>
                        {logoSrc ? (
                            <Image src={logoSrc} alt={logoAlt} className={logoClass}
                                   width={navBarConfig?.props?.logoWidth}
                                   height={navBarConfig?.props?.logoHeight}/>) : ''}
                        {navBarConfig?.props?.brandName != null &&
                            <span
                                className="btn navbar-brand text-primary">{navBarConfig?.props?.brandName}</span>}
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarcollapse"
                            aria-controls="navbarcollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div id="navbarcollapse" className="collapse navbar-collapse">
                    </div>
                </div>
            </nav>
        </header>
    )
}