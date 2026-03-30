import React from "react";
import clsx from "clsx";
import {type SpacingSize} from "./Block.js";

// https://getbootstrap.com/docs/5.0/utilities/vertical-align/
type InlineVerticalAlignType = "baseline" | "top" | "middle" | "bottom" | "text-bottom" | "text-top";


export type InlineType = React.HTMLAttributes<HTMLSpanElement> & {
    alignVertical?: InlineVerticalAlignType
    margin?: SpacingSize[]
    marginX?: SpacingSize[]
    marginY?: SpacingSize[]
    marginStart?: SpacingSize[]
    marginTop?: SpacingSize[]
    marginEnd?: SpacingSize[]
    marginBottom?: SpacingSize[]
}

/**
 * A text element (equivalent to span in HTML, text in Latex, box in typst)
 * We use text (and not inline) so that it's inline with the attribute name
 * (ie textAlign attribute on a paragraph is not called inlineAlign)
 */
export default function Text({
                                 children, alignVertical, margin,
                                 marginX,
                                 marginY,
                                 marginStart,
                                 marginTop,
                                 marginEnd,
                                 marginBottom, className, ...rest
                             }: InlineType) {

    return (
        <span className={clsx(
            className,
            margin != undefined && margin.map((margin) => `m-${margin}`),
            marginX != undefined && marginX.map((marginValue) => `mx-${marginValue}`),
            marginY != undefined && marginY.map((marginValue) => `my-${marginValue}`),
            marginStart != undefined && marginStart.map((marginValue) => `ms-${marginValue}`),
            marginTop != undefined && marginTop.map((marginValue) => `mt-${marginValue}`),
            marginEnd != undefined && marginEnd.map((marginValue) => `me-${marginValue}`),
            marginBottom != undefined && marginBottom.map((marginValue) => `mb-${marginValue}`),
            alignVertical && `align-${alignVertical}`
        )}
              {...rest}>
            {children}
        </span>
    )

}
