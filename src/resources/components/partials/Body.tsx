import type {ContextProps} from "@combostrap/interact/types";
import React from "react";


export type BodyProps = React.HtmlHTMLAttributes<HTMLBodyElement> & ContextProps;

// noinspection JSUnusedGlobalSymbols - imported dynamically via virtual module
export default function Body({request, page, ...props}: BodyProps) {

    return (
        <body {...props}>
        {props.children}
        </body>
    )
}