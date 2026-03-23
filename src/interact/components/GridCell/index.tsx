import React from "react";
import clsx from "clsx";

import Block, {type BlockType} from "../Block/index.js";

/**
 * Number only values applied to all view port
 * a col-12 will take the whole space
 * the basic is col-sm-12 col-md-4 for a 3 grid rows
 */
type ColSizeType = "1" | "xl-1" | "lg-1" | "md-1" | "sm-1" |
    "2" | "xl-2" | "lg-2" | "md-2" | "sm-2" |
    "3" | "xl-3" | "lg-3" | "md-3" | "sm-3" |
    "4" | "xl-4" | "lg-4" | "md-4" | "sm-4" |
    "5" | "xl-5" | "lg-5" | "md-5" | "sm-5" |
    "6" | "xl-6" | "lg-6" | "md-6" | "sm-6" |
    "7" | "xl-7" | "lg-7" | "md-7" | "sm-7" |
    "8" | "xl-8" | "lg-8" | "md-8" | "sm-8" |
    "9" | "xl-9" | "lg-9" | "md-9" | "sm-9" |
    "10" | "xl-10" | "lg-10" | "md-10" | "sm-10" |
    "11" | "xl-11" | "lg-11" | "md-11" | "sm-11" |
    "12" | "xl-12" | "lg-12" | "md-12" | "sm-12" |
    // auto = content
    "auto" | "xl-auto" | "lg-auto" | "md-auto" | "sm-auto";

export type BlockYAlignType =
    "start"
    | "end"
    | "center"
    | "sm-start"
    | "sm-center"
    | "sm-end"
    | "md-start"
    | "md-center"
    | "md-end"
    | "lg-start"
    | "lg-center"
    | "lg-end"
    | "xl-start"
    | "xl-center"
    | "xl-end";

export type GridCellType = BlockType & {
    size?: ColSizeType[],
    // https://getbootstrap.com/docs/5.0/utilities/flex/#align-self
    // blockXAlign comes from the BlockType.
    // blockYAlign has no used on block. y center is needed only on adjacent block
    blockYAlign?: BlockYAlignType[]
}

/**
 * https://getbootstrap.com/docs/5.3/layout/grid/#row-columns
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function GridCell({
                                     children,
                                     size,
                                     className,
                                     blockYAlign,
                                     blockXAlign = ["center"], // we always want that mostly
                                     ...rest
                                 }: GridCellType): React.JSX.Element {
    const alignArray: BlockYAlignType[] | undefined = Array.isArray(blockYAlign) ? blockYAlign : (blockYAlign != undefined ? ((blockYAlign as string).split(" ") as BlockYAlignType[]) : undefined);

    return (
        <Block
            className={clsx(
                size ? size.map((colSizeValue) => `col-${colSizeValue}`) : "col",
                alignArray != undefined && alignArray.map((yAlignValue) => `align-self-${yAlignValue}`),
                className
            )}
            blockXAlign={blockXAlign}
            {...rest}>
            {children}
        </Block>
    );
}