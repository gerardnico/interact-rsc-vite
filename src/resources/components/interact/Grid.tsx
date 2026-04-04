import React from "react";
import {cn} from "@/lib/utils";

type MaxRowCellsType = "0" | "xl-0" | "lg-0" | "md-0" | "sm-0" |
    "1" | "xl-1" | "lg-1" | "md-1" | "sm-1" |
    "2" | "xl-2" | "lg-2" | "md-2" | "sm-2" |
    "3" | "xl-3" | "lg-3" | "md-3" | "sm-3" |
    "4" | "xl-4" | "lg-4" | "md-4" | "sm-4" |
    "5" | "xl-5" | "lg-5" | "md-5" | "sm-5";

export type GridType = React.HTMLAttributes<HTMLDivElement> & {
    maxRowCells?: MaxRowCellsType[]
}

export default function Grid({
                                 children,
                                 className,
                                 maxRowCells,
                                 ...rest
                             }: GridType): React.JSX.Element {
    const maxRowCellsArray: MaxRowCellsType[] | undefined = Array.isArray(maxRowCells) ? maxRowCells : (maxRowCells != undefined ? ((maxRowCells as string).split(" ") as MaxRowCellsType[]) : undefined);
    return (
        <>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap-grid.min.css"/>
            <div className={
                cn(
                    "row",
                    className,
                    maxRowCellsArray && maxRowCellsArray.map((maxRowCellsValue) => `row-cols-${maxRowCellsValue.replace(":", "-")}`)
                )
            }{...rest}>
                {children}
            </div>
        </>
    );
}