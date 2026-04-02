/**
 * Navbar.
 * How it works, the container is a flex
 * In mobile screen, the label are pushed to the next line
 * via a flex grow in the {@link NavBarCollapse}
 */
import React from "react";
import {cn} from '@/lib/utils';


export default function NavBar({className, children, ...props}: React.HtmlHTMLAttributes<HTMLHtmlElement>) {

    return (

        <nav className={cn(className, "flex items-center justify-between md:flex-nowrap flex-wrap gap-4")} {...props}>
            {children}
        </nav>

    )
}