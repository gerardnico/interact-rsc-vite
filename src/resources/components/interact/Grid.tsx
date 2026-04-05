import React from "react";
import {cn} from "@/lib/utils";


// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function Grid({
                                 children,
                                 className,
                                 ...rest
                             }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
    return (
        <div className={
            cn(
                "cells",
                !className?.includes("justify") && "justify-center",
                className
            )
        }{...rest}>
            {children}
        </div>
    );
}