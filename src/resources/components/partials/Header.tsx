import NavBar from "@combostrap/interact/components/NavBar";
import NavBarCollapse from "@combostrap/interact/components/NavBarCollapse";
import {getInteractConfig} from "@combostrap/interact/config";
import Image from "@combostrap/interact/components/Image";
import ModeToggle from "@combostrap/interact/components/ModeToggle";
import type {ContextProps} from "@combostrap/interact/types";


// @ts-ignore - we don't use the request
export default async function Header(layoutProps: ContextProps) {

    const interactConfig = getInteractConfig();
    let homeUrl = interactConfig.site.base
    // Determine if the image is an SVG based on the file extension
    let logoSrc: string | undefined;
    let logoAlt: string | undefined;
    let logoClass: string | undefined;
    let headerConfig = interactConfig.components.Header;
    logoSrc = headerConfig?.props?.logoSrc;
    let logo;
    if (logoSrc != null) {
        if (interactConfig.site.base != "/") {
            logoSrc = `${interactConfig.site.base}${logoSrc}`
        } else {
            logoSrc = `${logoSrc}`
        }

        logoClass = "align-middle"
        logoAlt = headerConfig?.props?.logoAlt;
        if (typeof logoAlt == 'undefined') {
            logoAlt = interactConfig.site.name;
        }
        let imageProps = {
            src: logoSrc,
            alt: logoAlt,
            className: logoClass,
            width: headerConfig?.props?.logoWidth || 24,
            height: headerConfig?.props?.logoHeight || 24
        }
        logo = <Image {...imageProps}/>

    }
    const containerClass = interactConfig.style.container.containerClass

    // pb-0 is for the alignment with the brand text and logo
    // @ts-ignore
    const elementClass = "flex py-1 text-primary-700 no-underline pb-0"
    return (
        <header className={"border-b border-gray-200 px-4 py-2 print:hidden"}>
            <NavBar className={containerClass}>
                {/* Brand - flex because otherwise, the brand name goes next line */}
                <a className="link-primary flex no-underline"
                   href={homeUrl}
                   title={logoAlt}
                   accessKey="h" style={{fontWeight: 700}}>
                    {logo}
                    {headerConfig?.props?.brandName != null &&
                        <span
                            className="text-xl font-semibold text-primary">{headerConfig?.props?.brandName}</span>}
                </a>

                {/* Toggle (it is a client component) */}
                <NavBarCollapse>
                    {/*<a href="#" className={elementClass}>Todo</a>*/}
                    {/*<a href="#" className={elementClass}>Todo</a>*/}
                    {/*<a href="#" className={elementClass}>Todo</a>*/}
                    <div className={"ml-auto "}>
                        <ModeToggle/>
                    </div>
                </NavBarCollapse>
            </NavBar>
        </header>
    )
}