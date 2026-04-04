import React from "react";
import {cn} from "@/lib/utils";

export type GridType = React.HTMLAttributes<HTMLDivElement>

// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function Grid({
                                 children,
                                 className,
                                 ...rest
                             }: GridType): React.JSX.Element {
    return (
        <>
            <div className={
                cn(
                    "row",
                    className
                )
            }{...rest}>
                {children}
            </div>
        </>
    );
}