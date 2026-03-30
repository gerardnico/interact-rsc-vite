import React from "react";


export default function Anchor({children, href, target, ...rest}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {

    if (!target && href != null) {
        if (href.startsWith("http")) {
            target = "_blank";
        }
    }

    return (
        <a href={href} target={target} {...rest}>{children}</a>
    )

}
