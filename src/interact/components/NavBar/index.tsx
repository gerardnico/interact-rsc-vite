import {PAGE_CONTAINER} from "../classNames.js";
import {getInteractConfig} from "@combostrap/interact/config";
import Image from "../Image/index.js"
import type {TemplateProps} from "@combostrap/interact/types";
import Svg from "../Svg/index.js";

// @ts-ignore
export default function NavBar(props: TemplateProps) {

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
        logoClass = "d-inline-block align-text-top"
        logoAlt = navBarConfig?.props?.logoAlt;
        if (typeof logoAlt == 'undefined') {
            logoAlt = interactConfig.site.name;
        }
        let imageProps = {
            src: logoSrc,
            alt: logoAlt,
            className: logoClass,
            width: navBarConfig?.props?.logoWidth,
            height: navBarConfig?.props?.logoHeight
        }
        if (isSvg) {
            logo = <Svg {...imageProps} />
        } else {
            logo = <Image {...imageProps}/>
        }

    }
    const containerClass = interactConfig.style.container.containerClass
    return (
        <header id="page-header" className="d-print-none">
            <nav className="navbar navbar-expand-md navbar-light" data-type="fixed-top"
                 style={{backgroundColor: "var(--bs-light)"}}>
                <div className={PAGE_CONTAINER + " " + containerClass}>
                    <a className="link-primary"
                       href={homeUrl} title={interactConfig.site.title}
                       accessKey="h" style={{fontWeight: 700}}>
                        {logo}
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