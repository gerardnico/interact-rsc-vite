import React from "react";
import clsx from "clsx";
import Block, {type BlockType} from "./Block.js";

type MaxRowCellsType = "0" | "xl-0" | "lg-0" | "md-0" |
    "1" | "xl-1" | "lg-1" | "md-1" |
    "2" | "xl-2" | "lg-2" | "md-2" |
    "3" | "xl-3" | "lg-3" | "md-3" |
    "4" | "xl-4" | "lg-4" | "md-4" |
    "5" | "xl-5" | "lg-5" | "md-5";

export type GridType = BlockType & {
    maxRowCells?: MaxRowCellsType[]
}

export default function Grid({
                                 children,
                                 className,
                                 maxRowCells,
                                 ...rest
                             }: GridType): React.JSX.Element {
    return (
        <Block className={
            clsx(
                "row",
                className,
                maxRowCells && maxRowCells.map((maxRowCellsValue) => `row-cols-${maxRowCellsValue}`)
            )
        }{...rest}>
            {children}
        </Block>
    );
}