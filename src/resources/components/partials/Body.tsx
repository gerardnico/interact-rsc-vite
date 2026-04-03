import React from "react";
import type {LayoutProps} from "@combostrap/interact/types";


export type BodyProps = React.HtmlHTMLAttributes<HTMLBodyElement> & LayoutProps;

// noinspection JSUnusedGlobalSymbols - imported dynamically via virtual module
export default function Body({context, page, ...props}: BodyProps) {

    return (
        <body {...props}>
        {props.children}
        </body>
    )
}