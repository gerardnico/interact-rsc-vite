import NavBar from "@combostrap/interact/components/NavBar";
import NavBarCollapse from "@combostrap/interact/components/NavBarCollapse";
import {getInteractConfig} from "@combostrap/interact/config";
import Image from "@combostrap/interact/components/Image";
import ModeToggle from "@combostrap/interact/components/ModeToggle";
import type {LayoutProps} from "@combostrap/interact/types";
import SearchBox from "@/components/interact/SearchBox.tsx";
import {cn} from "@/lib/utils.ts";


// @ts-ignore
// noinspection JSUnusedLocalSymbols - we don't use the request
export default async function Header(layoutProps: LayoutProps) {

    const interactConfig = getInteractConfig();
    const homeUrl = interactConfig.site.base
    // Determine if the image is an SVG based on the file extension
    let logoSrc: string | undefined;
    let logoAlt: string | undefined;
    let logoClass: string | undefined;
    const headerConfig = interactConfig.template.header;
    logoSrc = headerConfig?.logoSrc;
    let logo;
    if (logoSrc != null) {

        logoClass = "align-middle"
        logoAlt = headerConfig?.logoAlt;
        if (typeof logoAlt == 'undefined') {
            logoAlt = interactConfig.site.name;
        }
        const imageProps = {
            src: logoSrc,
            alt: logoAlt,
            className: logoClass,
            width: headerConfig?.logoWidth, // no default on width as this is not relevant for the template
            height: headerConfig?.logoHeight || 24
        }
        logo = <Image {...imageProps}/>

    }
    const containerClass = interactConfig.template.container.containerClass

    // pb-0 is for the alignment with the brand text and logo
    // @ts-ignore
    return (
        <header className={"border-b border-gray-200 py-2 print:hidden"}>
            <NavBar className={cn(containerClass,"relative min-h-8")}>
                {/* Brand - flex because otherwise, the brand name goes next line */}
                <a className="link-primary flex no-underline"
                   href={homeUrl}
                   title={logoAlt}
                   accessKey="h" style={{fontWeight: 700}}>
                    {logo}
                    {headerConfig?.brandName != null &&
                        <span
                            className="text-xl font-semibold text-primary">{headerConfig?.brandName}</span>}
                </a>

                <div className={"absolute top-0 left-1/2 -translate-x-1/2 w-48 md:w-64"}>
                    <SearchBox className={""}/>
                </div>

                {/* Toggle (it is a client component) */}
                <NavBarCollapse>
                    {/*<a href="#" className={elementClass}>Todo</a>*/}
                    {/*<a href="#" className={elementClass}>Todo</a>*/}
                    <div className={"ml-auto "}>
                        {/*<a href="#" className={""}>Todo</a>*/}
                        <ModeToggle/>
                    </div>
                </NavBarCollapse>
            </NavBar>
        </header>
    )
}