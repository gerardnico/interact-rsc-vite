import React from "react";
import './hero.css';
import clsx from "clsx";
// https://getbootstrap.com/docs/5.0/utilities/text/#text-alignment
type textXAlignmentType = "start" | "center" | "end" |
    "md-start" | "md-center" | "md-end" |
    "lg-start" | "lg-center" | "lg-end" |
    "xl-start" | "xl-center" | "xl-end";
export type SpacingSize = "0" | "xl-0" | "lg-0" | "md-0" | "sm-0" |
    "1" | "xl-1" | "lg-1" | "md-1" | "sm-1" |
    "2" | "xl-2" | "lg-2" | "md-2" | "sm-2" |
    "3" | "xl-3" | "lg-3" | "md-3" | "sm-3" |
    "4" | "xl-4" | "lg-4" | "md-4" | "sm-4" |
    "5" | "xl-5" | "lg-5" | "md-5" | "sm-5";
type BlockXAlignmentType =
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
export type BlockType = React.HTMLAttributes<HTMLDivElement> & {
    // Hero exists because the padding 5 (p-5) is too small for a hero padding
    paddingHero?: "0" | "1" | "2" | "3"
    padding?: SpacingSize[]
    paddingX?: SpacingSize[]
    paddingY?: SpacingSize[]
    paddingStart?: SpacingSize[]
    paddingTop?: SpacingSize[]
    paddingEnd?: SpacingSize[]
    paddingBottom?: SpacingSize[]
    margin?: SpacingSize[]
    marginX?: SpacingSize[]
    marginY?: SpacingSize[]
    marginStart?: SpacingSize[]
    marginTop?: SpacingSize[]
    marginEnd?: SpacingSize[]
    marginBottom?: SpacingSize[]
    textAlign?: textXAlignmentType[]
    // An easy way to align in the center in a cell
    // for other horizontal align needs, see Grid and Grid Cell
    // in a publication, the flow goes top down, no need for Y alignment
    blockXAlign?: BlockXAlignmentType[]
    maxWidth?: string | 'auto'
}
export default function Block({
                                  padding,
                                  paddingHero,
                                  paddingX,
                                  paddingY,
                                  paddingStart,
                                  paddingTop,
                                  paddingEnd,
                                  paddingBottom, margin,
                                  marginX,
                                  marginY,
                                  marginStart,
                                  marginTop,
                                  marginEnd,
                                  marginBottom,
                                  className,
                                  blockXAlign,
                                  textAlign,
                                  maxWidth,
                                  style,
                                  children,
                                  ...rest
                              }: BlockType): React.JSX.Element {
    const alignArray: BlockXAlignmentType[] | undefined = Array.isArray(blockXAlign) ? blockXAlign : (blockXAlign != undefined ? ((blockXAlign as string).split(" ") as BlockXAlignmentType[]) : undefined);
    return (
        <div className={clsx(
            className,
            paddingHero != undefined && `hero-${paddingHero}`,
            padding != undefined && padding.map((padding) => `p-${padding}`),
            paddingX != undefined && paddingX.map((paddingValue) => `px-${paddingValue}`),
            paddingY != undefined && paddingY.map((paddingValue) => `py-${paddingValue}`),
            paddingStart != undefined && paddingStart.map((paddingValue) => `ps-${paddingValue}`),
            paddingTop != undefined && paddingTop.map((paddingValue) => `pt-${paddingValue}`),
            paddingEnd != undefined && paddingEnd.map((paddingValue) => `pe-${paddingValue}`),
            paddingBottom != undefined && paddingBottom.map((paddingValue) => `pb-${paddingValue}`),
            margin != undefined && margin.map((margin) => `m-${margin}`),
            marginX != undefined && marginX.map((marginValue) => `mx-${marginValue}`),
            marginY != undefined && marginY.map((marginValue) => `my-${marginValue}`),
            marginStart != undefined && marginStart.map((marginValue) => `ms-${marginValue}`),
            marginTop != undefined && marginTop.map((marginValue) => `mt-${marginValue}`),
            marginEnd != undefined && marginEnd.map((marginValue) => `me-${marginValue}`),
            marginBottom != undefined ? marginBottom.map((marginValue) => `mb-${marginValue}`) : "mb-3",
            // flex column so that they are aligned in a column
            alignArray != undefined && alignArray.map((xAlignValue) => `align-items-${xAlignValue}`),
            blockXAlign != undefined && 'd-flex flex-column',
            textAlign && `text-${textAlign}`
        )}
             style={{...(maxWidth && {maxWidth: maxWidth}), ...style}}
             {...rest}>
            {children}
        </div>
    );
}