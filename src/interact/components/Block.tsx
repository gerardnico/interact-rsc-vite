import React from "react";
import clsx from "clsx";
// Tailwind text alignment utilities
type textXAlignmentType = "start" | "center" | "end" |
    "md:start" | "md:center" | "md:end" |
    "lg:start" | "lg:center" | "lg:end" |
    "xl:start" | "xl:center" | "xl:end";
export type SpacingSize = "0" | "xl:0" | "lg:0" | "md:0" | "sm:0" |
    "1" | "xl:1" | "lg:1" | "md:1" | "sm:1" |
    "2" | "xl:2" | "lg:2" | "md:2" | "sm:2" |
    "3" | "xl:3" | "lg:3" | "md:3" | "sm:3" |
    "4" | "xl:4" | "lg:4" | "md:4" | "sm:4" |
    "5" | "xl:5" | "lg:5" | "md:5" | "sm:5" |
    "6" | "xl:6" | "lg:6" | "md:6" | "sm:6" |
    "8" | "xl:8" | "lg:8" | "md:8" | "sm:8" |
    "10" | "xl:10" | "lg:10" | "md:10" | "sm:10" |
    "12" | "xl:12" | "lg:12" | "md:12" | "sm:12" |
    "16" | "xl:16" | "lg:16" | "md:16" | "sm:16" |
    "20" | "xl:20" | "lg:20" | "md:20" | "sm:20" |
    "24" | "xl:24" | "lg:24" | "md:24" | "sm:24";
type BlockXAlignmentType =
    "start"
    | "end"
    | "center"
    | "sm:start"
    | "sm:center"
    | "sm:end"
    | "md:start"
    | "md:center"
    | "md:end"
    | "lg:start"
    | "lg:center"
    | "lg:end"
    | "xl:start"
    | "xl:center"
    | "xl:end";
export type BlockType = React.HTMLAttributes<HTMLDivElement> & {
    // Hero padding for large hero sections
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
    
    // Helper function to convert spacing size to Tailwind class
    const toTailwindSpacing = (prefix: 'p' | 'px' | 'py' | 'ps' | 'pt' | 'pe' | 'pb' | 'm' | 'mx' | 'my' | 'ms' | 'mt' | 'me' | 'mb', values: SpacingSize[] | undefined): string[] => {
        if (!values) return [];
        return values.map(value => {
            switch (value) {
                // Padding classes
                case '0': return prefix === 'p' ? 'p-0' : prefix === 'px' ? 'px-0' : prefix === 'py' ? 'py-0' : prefix === 'ps' ? 'ps-0' : prefix === 'pt' ? 'pt-0' : prefix === 'pe' ? 'pe-0' : prefix === 'pb' ? 'pb-0' : prefix === 'm' ? 'm-0' : prefix === 'mx' ? 'mx-0' : prefix === 'my' ? 'my-0' : prefix === 'ms' ? 'ms-0' : prefix === 'mt' ? 'mt-0' : prefix === 'me' ? 'me-0' : 'mb-0';
                case '1': return prefix === 'p' ? 'p-1' : prefix === 'px' ? 'px-1' : prefix === 'py' ? 'py-1' : prefix === 'ps' ? 'ps-1' : prefix === 'pt' ? 'pt-1' : prefix === 'pe' ? 'pe-1' : prefix === 'pb' ? 'pb-1' : prefix === 'm' ? 'm-1' : prefix === 'mx' ? 'mx-1' : prefix === 'my' ? 'my-1' : prefix === 'ms' ? 'ms-1' : prefix === 'mt' ? 'mt-1' : prefix === 'me' ? 'me-1' : 'mb-1';
                case '2': return prefix === 'p' ? 'p-2' : prefix === 'px' ? 'px-2' : prefix === 'py' ? 'py-2' : prefix === 'ps' ? 'ps-2' : prefix === 'pt' ? 'pt-2' : prefix === 'pe' ? 'pe-2' : prefix === 'pb' ? 'pb-2' : prefix === 'm' ? 'm-2' : prefix === 'mx' ? 'mx-2' : prefix === 'my' ? 'my-2' : prefix === 'ms' ? 'ms-2' : prefix === 'mt' ? 'mt-2' : prefix === 'me' ? 'me-2' : 'mb-2';
                case '3': return prefix === 'p' ? 'p-3' : prefix === 'px' ? 'px-3' : prefix === 'py' ? 'py-3' : prefix === 'ps' ? 'ps-3' : prefix === 'pt' ? 'pt-3' : prefix === 'pe' ? 'pe-3' : prefix === 'pb' ? 'pb-3' : prefix === 'm' ? 'm-3' : prefix === 'mx' ? 'mx-3' : prefix === 'my' ? 'my-3' : prefix === 'ms' ? 'ms-3' : prefix === 'mt' ? 'mt-3' : prefix === 'me' ? 'me-3' : 'mb-3';
                case '4': return prefix === 'p' ? 'p-4' : prefix === 'px' ? 'px-4' : prefix === 'py' ? 'py-4' : prefix === 'ps' ? 'ps-4' : prefix === 'pt' ? 'pt-4' : prefix === 'pe' ? 'pe-4' : prefix === 'pb' ? 'pb-4' : prefix === 'm' ? 'm-4' : prefix === 'mx' ? 'mx-4' : prefix === 'my' ? 'my-4' : prefix === 'ms' ? 'ms-4' : prefix === 'mt' ? 'mt-4' : prefix === 'me' ? 'me-4' : 'mb-4';
                case '5': return prefix === 'p' ? 'p-5' : prefix === 'px' ? 'px-5' : prefix === 'py' ? 'py-5' : prefix === 'ps' ? 'ps-5' : prefix === 'pt' ? 'pt-5' : prefix === 'pe' ? 'pe-5' : prefix === 'pb' ? 'pb-5' : prefix === 'm' ? 'm-5' : prefix === 'mx' ? 'mx-5' : prefix === 'my' ? 'my-5' : prefix === 'ms' ? 'ms-5' : prefix === 'mt' ? 'mt-5' : prefix === 'me' ? 'me-5' : 'mb-5';
                case '6': return prefix === 'p' ? 'p-6' : prefix === 'px' ? 'px-6' : prefix === 'py' ? 'py-6' : prefix === 'ps' ? 'ps-6' : prefix === 'pt' ? 'pt-6' : prefix === 'pe' ? 'pe-6' : prefix === 'pb' ? 'pb-6' : prefix === 'm' ? 'm-6' : prefix === 'mx' ? 'mx-6' : prefix === 'my' ? 'my-6' : prefix === 'ms' ? 'ms-6' : prefix === 'mt' ? 'mt-6' : prefix === 'me' ? 'me-6' : 'mb-6';
                case '8': return prefix === 'p' ? 'p-8' : prefix === 'px' ? 'px-8' : prefix === 'py' ? 'py-8' : prefix === 'ps' ? 'ps-8' : prefix === 'pt' ? 'pt-8' : prefix === 'pe' ? 'pe-8' : prefix === 'pb' ? 'pb-8' : prefix === 'm' ? 'm-8' : prefix === 'mx' ? 'mx-8' : prefix === 'my' ? 'my-8' : prefix === 'ms' ? 'ms-8' : prefix === 'mt' ? 'mt-8' : prefix === 'me' ? 'me-8' : 'mb-8';
                case '10': return prefix === 'p' ? 'p-10' : prefix === 'px' ? 'px-10' : prefix === 'py' ? 'py-10' : prefix === 'ps' ? 'ps-10' : prefix === 'pt' ? 'pt-10' : prefix === 'pe' ? 'pe-10' : prefix === 'pb' ? 'pb-10' : prefix === 'm' ? 'm-10' : prefix === 'mx' ? 'mx-10' : prefix === 'my' ? 'my-10' : prefix === 'ms' ? 'ms-10' : prefix === 'mt' ? 'mt-10' : prefix === 'me' ? 'me-10' : 'mb-10';
                case '12': return prefix === 'p' ? 'p-12' : prefix === 'px' ? 'px-12' : prefix === 'py' ? 'py-12' : prefix === 'ps' ? 'ps-12' : prefix === 'pt' ? 'pt-12' : prefix === 'pe' ? 'pe-12' : prefix === 'pb' ? 'pb-12' : prefix === 'm' ? 'm-12' : prefix === 'mx' ? 'mx-12' : prefix === 'my' ? 'my-12' : prefix === 'ms' ? 'ms-12' : prefix === 'mt' ? 'mt-12' : prefix === 'me' ? 'me-12' : 'mb-12';
                case '16': return prefix === 'p' ? 'p-16' : prefix === 'px' ? 'px-16' : prefix === 'py' ? 'py-16' : prefix === 'ps' ? 'ps-16' : prefix === 'pt' ? 'pt-16' : prefix === 'pe' ? 'pe-16' : prefix === 'pb' ? 'pb-16' : prefix === 'm' ? 'm-16' : prefix === 'mx' ? 'mx-16' : prefix === 'my' ? 'my-16' : prefix === 'ms' ? 'ms-16' : prefix === 'mt' ? 'mt-16' : prefix === 'me' ? 'me-16' : 'mb-16';
                case '20': return prefix === 'p' ? 'p-20' : prefix === 'px' ? 'px-20' : prefix === 'py' ? 'py-20' : prefix === 'ps' ? 'ps-20' : prefix === 'pt' ? 'pt-20' : prefix === 'pe' ? 'pe-20' : prefix === 'pb' ? 'pb-20' : prefix === 'm' ? 'm-20' : prefix === 'mx' ? 'mx-20' : prefix === 'my' ? 'my-20' : prefix === 'ms' ? 'ms-20' : prefix === 'mt' ? 'mt-20' : prefix === 'me' ? 'me-20' : 'mb-20';
                case '24': return prefix === 'p' ? 'p-24' : prefix === 'px' ? 'px-24' : prefix === 'py' ? 'py-24' : prefix === 'ps' ? 'ps-24' : prefix === 'pt' ? 'pt-24' : prefix === 'pe' ? 'pe-24' : prefix === 'pb' ? 'pb-24' : prefix === 'm' ? 'm-24' : prefix === 'mx' ? 'mx-24' : prefix === 'my' ? 'my-24' : prefix === 'ms' ? 'ms-24' : prefix === 'mt' ? 'mt-24' : prefix === 'me' ? 'me-24' : 'mb-24';
                // Responsive classes
                case 'sm:0': return prefix === 'p' ? 'sm:p-0' : prefix === 'px' ? 'sm:px-0' : prefix === 'py' ? 'sm:py-0' : prefix === 'ps' ? 'sm:ps-0' : prefix === 'pt' ? 'sm:pt-0' : prefix === 'pe' ? 'sm:pe-0' : prefix === 'pb' ? 'sm:pb-0' : prefix === 'm' ? 'sm:m-0' : prefix === 'mx' ? 'sm:mx-0' : prefix === 'my' ? 'sm:my-0' : prefix === 'ms' ? 'sm:ms-0' : prefix === 'mt' ? 'sm:mt-0' : prefix === 'me' ? 'sm:me-0' : 'sm:mb-0';
                case 'sm:1': return prefix === 'p' ? 'sm:p-1' : prefix === 'px' ? 'sm:px-1' : prefix === 'py' ? 'sm:py-1' : prefix === 'ps' ? 'sm:ps-1' : prefix === 'pt' ? 'sm:pt-1' : prefix === 'pe' ? 'sm:pe-1' : prefix === 'pb' ? 'sm:pb-1' : prefix === 'm' ? 'sm:m-1' : prefix === 'mx' ? 'sm:mx-1' : prefix === 'my' ? 'sm:my-1' : prefix === 'ms' ? 'sm:ms-1' : prefix === 'mt' ? 'sm:mt-1' : prefix === 'me' ? 'sm:me-1' : 'sm:mb-1';
                case 'sm:2': return prefix === 'p' ? 'sm:p-2' : prefix === 'px' ? 'sm:px-2' : prefix === 'py' ? 'sm:py-2' : prefix === 'ps' ? 'sm:ps-2' : prefix === 'pt' ? 'sm:pt-2' : prefix === 'pe' ? 'sm:pe-2' : prefix === 'pb' ? 'sm:pb-2' : prefix === 'm' ? 'sm:m-2' : prefix === 'mx' ? 'sm:mx-2' : prefix === 'my' ? 'sm:my-2' : prefix === 'ms' ? 'sm:ms-2' : prefix === 'mt' ? 'sm:mt-2' : prefix === 'me' ? 'sm:me-2' : 'sm:mb-2';
                case 'sm:3': return prefix === 'p' ? 'sm:p-3' : prefix === 'px' ? 'sm:px-3' : prefix === 'py' ? 'sm:py-3' : prefix === 'ps' ? 'sm:ps-3' : prefix === 'pt' ? 'sm:pt-3' : prefix === 'pe' ? 'sm:pe-3' : prefix === 'pb' ? 'sm:pb-3' : prefix === 'm' ? 'sm:m-3' : prefix === 'mx' ? 'sm:mx-3' : prefix === 'my' ? 'sm:my-3' : prefix === 'ms' ? 'sm:ms-3' : prefix === 'mt' ? 'sm:mt-3' : prefix === 'me' ? 'sm:me-3' : 'sm:mb-3';
                case 'sm:4': return prefix === 'p' ? 'sm:p-4' : prefix === 'px' ? 'sm:px-4' : prefix === 'py' ? 'sm:py-4' : prefix === 'ps' ? 'sm:ps-4' : prefix === 'pt' ? 'sm:pt-4' : prefix === 'pe' ? 'sm:pe-4' : prefix === 'pb' ? 'sm:pb-4' : prefix === 'm' ? 'sm:m-4' : prefix === 'mx' ? 'sm:mx-4' : prefix === 'my' ? 'sm:my-4' : prefix === 'ms' ? 'sm:ms-4' : prefix === 'mt' ? 'sm:mt-4' : prefix === 'me' ? 'sm:me-4' : 'sm:mb-4';
                case 'sm:5': return prefix === 'p' ? 'sm:p-5' : prefix === 'px' ? 'sm:px-5' : prefix === 'py' ? 'sm:py-5' : prefix === 'ps' ? 'sm:ps-5' : prefix === 'pt' ? 'sm:pt-5' : prefix === 'pe' ? 'sm:pe-5' : prefix === 'pb' ? 'sm:pb-5' : prefix === 'm' ? 'sm:m-5' : prefix === 'mx' ? 'sm:mx-5' : prefix === 'my' ? 'sm:my-5' : prefix === 'ms' ? 'sm:ms-5' : prefix === 'mt' ? 'sm:mt-5' : prefix === 'me' ? 'sm:me-5' : 'sm:mb-5';
                case 'sm:6': return prefix === 'p' ? 'sm:p-6' : prefix === 'px' ? 'sm:px-6' : prefix === 'py' ? 'sm:py-6' : prefix === 'ps' ? 'sm:ps-6' : prefix === 'pt' ? 'sm:pt-6' : prefix === 'pe' ? 'sm:pe-6' : prefix === 'pb' ? 'sm:pb-6' : prefix === 'm' ? 'sm:m-6' : prefix === 'mx' ? 'sm:mx-6' : prefix === 'my' ? 'sm:my-6' : prefix === 'ms' ? 'sm:ms-6' : prefix === 'mt' ? 'sm:mt-6' : prefix === 'me' ? 'sm:me-6' : 'sm:mb-6';
                case 'sm:8': return prefix === 'p' ? 'sm:p-8' : prefix === 'px' ? 'sm:px-8' : prefix === 'py' ? 'sm:py-8' : prefix === 'ps' ? 'sm:ps-8' : prefix === 'pt' ? 'sm:pt-8' : prefix === 'pe' ? 'sm:pe-8' : prefix === 'pb' ? 'sm:pb-8' : prefix === 'm' ? 'sm:m-8' : prefix === 'mx' ? 'sm:mx-8' : prefix === 'my' ? 'sm:my-8' : prefix === 'ms' ? 'sm:ms-8' : prefix === 'mt' ? 'sm:mt-8' : prefix === 'me' ? 'sm:me-8' : 'sm:mb-8';
                case 'sm:10': return prefix === 'p' ? 'sm:p-10' : prefix === 'px' ? 'sm:px-10' : prefix === 'py' ? 'sm:py-10' : prefix === 'ps' ? 'sm:ps-10' : prefix === 'pt' ? 'sm:pt-10' : prefix === 'pe' ? 'sm:pe-10' : prefix === 'pb' ? 'sm:pb-10' : prefix === 'm' ? 'sm:m-10' : prefix === 'mx' ? 'sm:mx-10' : prefix === 'my' ? 'sm:my-10' : prefix === 'ms' ? 'sm:ms-10' : prefix === 'mt' ? 'sm:mt-10' : prefix === 'me' ? 'sm:me-10' : 'sm:mb-10';
                case 'sm:12': return prefix === 'p' ? 'sm:p-12' : prefix === 'px' ? 'sm:px-12' : prefix === 'py' ? 'sm:py-12' : prefix === 'ps' ? 'sm:ps-12' : prefix === 'pt' ? 'sm:pt-12' : prefix === 'pe' ? 'sm:pe-12' : prefix === 'pb' ? 'sm:pb-12' : prefix === 'm' ? 'sm:m-12' : prefix === 'mx' ? 'sm:mx-12' : prefix === 'my' ? 'sm:my-12' : prefix === 'ms' ? 'sm:ms-12' : prefix === 'mt' ? 'sm:mt-12' : prefix === 'me' ? 'sm:me-12' : 'sm:mb-12';
                case 'sm:16': return prefix === 'p' ? 'sm:p-16' : prefix === 'px' ? 'sm:px-16' : prefix === 'py' ? 'sm:py-16' : prefix === 'ps' ? 'sm:ps-16' : prefix === 'pt' ? 'sm:pt-16' : prefix === 'pe' ? 'sm:pe-16' : prefix === 'pb' ? 'sm:pb-16' : prefix === 'm' ? 'sm:m-16' : prefix === 'mx' ? 'sm:mx-16' : prefix === 'my' ? 'sm:my-16' : prefix === 'ms' ? 'sm:ms-16' : prefix === 'mt' ? 'sm:mt-16' : prefix === 'me' ? 'sm:me-16' : 'sm:mb-16';
                case 'sm:20': return prefix === 'p' ? 'sm:p-20' : prefix === 'px' ? 'sm:px-20' : prefix === 'py' ? 'sm:py-20' : prefix === 'ps' ? 'sm:ps-20' : prefix === 'pt' ? 'sm:pt-20' : prefix === 'pe' ? 'sm:pe-20' : prefix === 'pb' ? 'sm:pb-20' : prefix === 'm' ? 'sm:m-20' : prefix === 'mx' ? 'sm:mx-20' : prefix === 'my' ? 'sm:my-20' : prefix === 'ms' ? 'sm:ms-20' : prefix === 'mt' ? 'sm:mt-20' : prefix === 'me' ? 'sm:me-20' : 'sm:mb-20';
                case 'sm:24': return prefix === 'p' ? 'sm:p-24' : prefix === 'px' ? 'sm:px-24' : prefix === 'py' ? 'sm:py-24' : prefix === 'ps' ? 'sm:ps-24' : prefix === 'pt' ? 'sm:pt-24' : prefix === 'pe' ? 'sm:pe-24' : prefix === 'pb' ? 'sm:pb-24' : prefix === 'm' ? 'sm:m-24' : prefix === 'mx' ? 'sm:mx-24' : prefix === 'my' ? 'sm:my-24' : prefix === 'ms' ? 'sm:ms-24' : prefix === 'mt' ? 'sm:mt-24' : prefix === 'me' ? 'sm:me-24' : 'sm:mb-24';
                case 'md:0': return prefix === 'p' ? 'md:p-0' : prefix === 'px' ? 'md:px-0' : prefix === 'py' ? 'md:py-0' : prefix === 'ps' ? 'md:ps-0' : prefix === 'pt' ? 'md:pt-0' : prefix === 'pe' ? 'md:pe-0' : prefix === 'pb' ? 'md:pb-0' : prefix === 'm' ? 'md:m-0' : prefix === 'mx' ? 'md:mx-0' : prefix === 'my' ? 'md:my-0' : prefix === 'ms' ? 'md:ms-0' : prefix === 'mt' ? 'md:mt-0' : prefix === 'me' ? 'md:me-0' : 'md:mb-0';
                case 'md:1': return prefix === 'p' ? 'md:p-1' : prefix === 'px' ? 'md:px-1' : prefix === 'py' ? 'md:py-1' : prefix === 'ps' ? 'md:ps-1' : prefix === 'pt' ? 'md:pt-1' : prefix === 'pe' ? 'md:pe-1' : prefix === 'pb' ? 'md:pb-1' : prefix === 'm' ? 'md:m-1' : prefix === 'mx' ? 'md:mx-1' : prefix === 'my' ? 'md:my-1' : prefix === 'ms' ? 'md:ms-1' : prefix === 'mt' ? 'md:mt-1' : prefix === 'me' ? 'md:me-1' : 'md:mb-1';
                case 'md:2': return prefix === 'p' ? 'md:p-2' : prefix === 'px' ? 'md:px-2' : prefix === 'py' ? 'md:py-2' : prefix === 'ps' ? 'md:ps-2' : prefix === 'pt' ? 'md:pt-2' : prefix === 'pe' ? 'md:pe-2' : prefix === 'pb' ? 'md:pb-2' : prefix === 'm' ? 'md:m-2' : prefix === 'mx' ? 'md:mx-2' : prefix === 'my' ? 'md:my-2' : prefix === 'ms' ? 'md:ms-2' : prefix === 'mt' ? 'md:mt-2' : prefix === 'me' ? 'md:me-2' : 'md:mb-2';
                case 'md:3': return prefix === 'p' ? 'md:p-3' : prefix === 'px' ? 'md:px-3' : prefix === 'py' ? 'md:py-3' : prefix === 'ps' ? 'md:ps-3' : prefix === 'pt' ? 'md:pt-3' : prefix === 'pe' ? 'md:pe-3' : prefix === 'pb' ? 'md:pb-3' : prefix === 'm' ? 'md:m-3' : prefix === 'mx' ? 'md:mx-3' : prefix === 'my' ? 'md:my-3' : prefix === 'ms' ? 'md:ms-3' : prefix === 'mt' ? 'md:mt-3' : prefix === 'me' ? 'md:me-3' : 'md:mb-3';
                case 'md:4': return prefix === 'p' ? 'md:p-4' : prefix === 'px' ? 'md:px-4' : prefix === 'py' ? 'md:py-4' : prefix === 'ps' ? 'md:ps-4' : prefix === 'pt' ? 'md:pt-4' : prefix === 'pe' ? 'md:pe-4' : prefix === 'pb' ? 'md:pb-4' : prefix === 'm' ? 'md:m-4' : prefix === 'mx' ? 'md:mx-4' : prefix === 'my' ? 'md:my-4' : prefix === 'ms' ? 'md:ms-4' : prefix === 'mt' ? 'md:mt-4' : prefix === 'me' ? 'md:me-4' : 'md:mb-4';
                case 'md:5': return prefix === 'p' ? 'md:p-5' : prefix === 'px' ? 'md:px-5' : prefix === 'py' ? 'md:py-5' : prefix === 'ps' ? 'md:ps-5' : prefix === 'pt' ? 'md:pt-5' : prefix === 'pe' ? 'md:pe-5' : prefix === 'pb' ? 'md:pb-5' : prefix === 'm' ? 'md:m-5' : prefix === 'mx' ? 'md:mx-5' : prefix === 'my' ? 'md:my-5' : prefix === 'ms' ? 'md:ms-5' : prefix === 'mt' ? 'md:mt-5' : prefix === 'me' ? 'md:me-5' : 'md:mb-5';
                case 'md:6': return prefix === 'p' ? 'md:p-6' : prefix === 'px' ? 'md:px-6' : prefix === 'py' ? 'md:py-6' : prefix === 'ps' ? 'md:ps-6' : prefix === 'pt' ? 'md:pt-6' : prefix === 'pe' ? 'md:pe-6' : prefix === 'pb' ? 'md:pb-6' : prefix === 'm' ? 'md:m-6' : prefix === 'mx' ? 'md:mx-6' : prefix === 'my' ? 'md:my-6' : prefix === 'ms' ? 'md:ms-6' : prefix === 'mt' ? 'md:mt-6' : prefix === 'me' ? 'md:me-6' : 'md:mb-6';
                case 'md:8': return prefix === 'p' ? 'md:p-8' : prefix === 'px' ? 'md:px-8' : prefix === 'py' ? 'md:py-8' : prefix === 'ps' ? 'md:ps-8' : prefix === 'pt' ? 'md:pt-8' : prefix === 'pe' ? 'md:pe-8' : prefix === 'pb' ? 'md:pb-8' : prefix === 'm' ? 'md:m-8' : prefix === 'mx' ? 'md:mx-8' : prefix === 'my' ? 'md:my-8' : prefix === 'ms' ? 'md:ms-8' : prefix === 'mt' ? 'md:mt-8' : prefix === 'me' ? 'md:me-8' : 'md:mb-8';
                case 'md:10': return prefix === 'p' ? 'md:p-10' : prefix === 'px' ? 'md:px-10' : prefix === 'py' ? 'md:py-10' : prefix === 'ps' ? 'md:ps-10' : prefix === 'pt' ? 'md:pt-10' : prefix === 'pe' ? 'md:pe-10' : prefix === 'pb' ? 'md:pb-10' : prefix === 'm' ? 'md:m-10' : prefix === 'mx' ? 'md:mx-10' : prefix === 'my' ? 'md:my-10' : prefix === 'ms' ? 'md:ms-10' : prefix === 'mt' ? 'md:mt-10' : prefix === 'me' ? 'md:me-10' : 'md:mb-10';
                case 'md:12': return prefix === 'p' ? 'md:p-12' : prefix === 'px' ? 'md:px-12' : prefix === 'py' ? 'md:py-12' : prefix === 'ps' ? 'md:ps-12' : prefix === 'pt' ? 'md:pt-12' : prefix === 'pe' ? 'md:pe-12' : prefix === 'pb' ? 'md:pb-12' : prefix === 'm' ? 'md:m-12' : prefix === 'mx' ? 'md:mx-12' : prefix === 'my' ? 'md:my-12' : prefix === 'ms' ? 'md:ms-12' : prefix === 'mt' ? 'md:mt-12' : prefix === 'me' ? 'md:me-12' : 'md:mb-12';
                case 'md:16': return prefix === 'p' ? 'md:p-16' : prefix === 'px' ? 'md:px-16' : prefix === 'py' ? 'md:py-16' : prefix === 'ps' ? 'md:ps-16' : prefix === 'pt' ? 'md:pt-16' : prefix === 'pe' ? 'md:pe-16' : prefix === 'pb' ? 'md:pb-16' : prefix === 'm' ? 'md:m-16' : prefix === 'mx' ? 'md:mx-16' : prefix === 'my' ? 'md:my-16' : prefix === 'ms' ? 'md:ms-16' : prefix === 'mt' ? 'md:mt-16' : prefix === 'me' ? 'md:me-16' : 'md:mb-16';
                case 'md:20': return prefix === 'p' ? 'md:p-20' : prefix === 'px' ? 'md:px-20' : prefix === 'py' ? 'md:py-20' : prefix === 'ps' ? 'md:ps-20' : prefix === 'pt' ? 'md:pt-20' : prefix === 'pe' ? 'md:pe-20' : prefix === 'pb' ? 'md:pb-20' : prefix === 'm' ? 'md:m-20' : prefix === 'mx' ? 'md:mx-20' : prefix === 'my' ? 'md:my-20' : prefix === 'ms' ? 'md:ms-20' : prefix === 'mt' ? 'md:mt-20' : prefix === 'me' ? 'md:me-20' : 'md:mb-20';
                case 'md:24': return prefix === 'p' ? 'md:p-24' : prefix === 'px' ? 'md:px-24' : prefix === 'py' ? 'md:py-24' : prefix === 'ps' ? 'md:ps-24' : prefix === 'pt' ? 'md:pt-24' : prefix === 'pe' ? 'md:pe-24' : prefix === 'pb' ? 'md:pb-24' : prefix === 'm' ? 'md:m-24' : prefix === 'mx' ? 'md:mx-24' : prefix === 'my' ? 'md:my-24' : prefix === 'ms' ? 'md:ms-24' : prefix === 'mt' ? 'md:mt-24' : prefix === 'me' ? 'md:me-24' : 'md:mb-24';
                case 'lg:0': return prefix === 'p' ? 'lg:p-0' : prefix === 'px' ? 'lg:px-0' : prefix === 'py' ? 'lg:py-0' : prefix === 'ps' ? 'lg:ps-0' : prefix === 'pt' ? 'lg:pt-0' : prefix === 'pe' ? 'lg:pe-0' : prefix === 'pb' ? 'lg:pb-0' : prefix === 'm' ? 'lg:m-0' : prefix === 'mx' ? 'lg:mx-0' : prefix === 'my' ? 'lg:my-0' : prefix === 'ms' ? 'lg:ms-0' : prefix === 'mt' ? 'lg:mt-0' : prefix === 'me' ? 'lg:me-0' : 'lg:mb-0';
                case 'lg:1': return prefix === 'p' ? 'lg:p-1' : prefix === 'px' ? 'lg:px-1' : prefix === 'py' ? 'lg:py-1' : prefix === 'ps' ? 'lg:ps-1' : prefix === 'pt' ? 'lg:pt-1' : prefix === 'pe' ? 'lg:pe-1' : prefix === 'pb' ? 'lg:pb-1' : prefix === 'm' ? 'lg:m-1' : prefix === 'mx' ? 'lg:mx-1' : prefix === 'my' ? 'lg:my-1' : prefix === 'ms' ? 'lg:ms-1' : prefix === 'mt' ? 'lg:mt-1' : prefix === 'me' ? 'lg:me-1' : 'lg:mb-1';
                case 'lg:2': return prefix === 'p' ? 'lg:p-2' : prefix === 'px' ? 'lg:px-2' : prefix === 'py' ? 'lg:py-2' : prefix === 'ps' ? 'lg:ps-2' : prefix === 'pt' ? 'lg:pt-2' : prefix === 'pe' ? 'lg:pe-2' : prefix === 'pb' ? 'lg:pb-2' : prefix === 'm' ? 'lg:m-2' : prefix === 'mx' ? 'lg:mx-2' : prefix === 'my' ? 'lg:my-2' : prefix === 'ms' ? 'lg:ms-2' : prefix === 'mt' ? 'lg:mt-2' : prefix === 'me' ? 'lg:me-2' : 'lg:mb-2';
                case 'lg:3': return prefix === 'p' ? 'lg:p-3' : prefix === 'px' ? 'lg:px-3' : prefix === 'py' ? 'lg:py-3' : prefix === 'ps' ? 'lg:ps-3' : prefix === 'pt' ? 'lg:pt-3' : prefix === 'pe' ? 'lg:pe-3' : prefix === 'pb' ? 'lg:pb-3' : prefix === 'm' ? 'lg:m-3' : prefix === 'mx' ? 'lg:mx-3' : prefix === 'my' ? 'lg:my-3' : prefix === 'ms' ? 'lg:ms-3' : prefix === 'mt' ? 'lg:mt-3' : prefix === 'me' ? 'lg:me-3' : 'lg:mb-3';
                case 'lg:4': return prefix === 'p' ? 'lg:p-4' : prefix === 'px' ? 'lg:px-4' : prefix === 'py' ? 'lg:py-4' : prefix === 'ps' ? 'lg:ps-4' : prefix === 'pt' ? 'lg:pt-4' : prefix === 'pe' ? 'lg:pe-4' : prefix === 'pb' ? 'lg:pb-4' : prefix === 'm' ? 'lg:m-4' : prefix === 'mx' ? 'lg:mx-4' : prefix === 'my' ? 'lg:my-4' : prefix === 'ms' ? 'lg:ms-4' : prefix === 'mt' ? 'lg:mt-4' : prefix === 'me' ? 'lg:me-4' : 'lg:mb-4';
                case 'lg:5': return prefix === 'p' ? 'lg:p-5' : prefix === 'px' ? 'lg:px-5' : prefix === 'py' ? 'lg:py-5' : prefix === 'ps' ? 'lg:ps-5' : prefix === 'pt' ? 'lg:pt-5' : prefix === 'pe' ? 'lg:pe-5' : prefix === 'pb' ? 'lg:pb-5' : prefix === 'm' ? 'lg:m-5' : prefix === 'mx' ? 'lg:mx-5' : prefix === 'my' ? 'lg:my-5' : prefix === 'ms' ? 'lg:ms-5' : prefix === 'mt' ? 'lg:mt-5' : prefix === 'me' ? 'lg:me-5' : 'lg:mb-5';
                case 'lg:6': return prefix === 'p' ? 'lg:p-6' : prefix === 'px' ? 'lg:px-6' : prefix === 'py' ? 'lg:py-6' : prefix === 'ps' ? 'lg:ps-6' : prefix === 'pt' ? 'lg:pt-6' : prefix === 'pe' ? 'lg:pe-6' : prefix === 'pb' ? 'lg:pb-6' : prefix === 'm' ? 'lg:m-6' : prefix === 'mx' ? 'lg:mx-6' : prefix === 'my' ? 'lg:my-6' : prefix === 'ms' ? 'lg:ms-6' : prefix === 'mt' ? 'lg:mt-6' : prefix === 'me' ? 'lg:me-6' : 'lg:mb-6';
                case 'lg:8': return prefix === 'p' ? 'lg:p-8' : prefix === 'px' ? 'lg:px-8' : prefix === 'py' ? 'lg:py-8' : prefix === 'ps' ? 'lg:ps-8' : prefix === 'pt' ? 'lg:pt-8' : prefix === 'pe' ? 'lg:pe-8' : prefix === 'pb' ? 'lg:pb-8' : prefix === 'm' ? 'lg:m-8' : prefix === 'mx' ? 'lg:mx-8' : prefix === 'my' ? 'lg:my-8' : prefix === 'ms' ? 'lg:ms-8' : prefix === 'mt' ? 'lg:mt-8' : prefix === 'me' ? 'lg:me-8' : 'lg:mb-8';
                case 'lg:10': return prefix === 'p' ? 'lg:p-10' : prefix === 'px' ? 'lg:px-10' : prefix === 'py' ? 'lg:py-10' : prefix === 'ps' ? 'lg:ps-10' : prefix === 'pt' ? 'lg:pt-10' : prefix === 'pe' ? 'lg:pe-10' : prefix === 'pb' ? 'lg:pb-10' : prefix === 'm' ? 'lg:m-10' : prefix === 'mx' ? 'lg:mx-10' : prefix === 'my' ? 'lg:my-10' : prefix === 'ms' ? 'lg:ms-10' : prefix === 'mt' ? 'lg:mt-10' : prefix === 'me' ? 'lg:me-10' : 'lg:mb-10';
                case 'lg:12': return prefix === 'p' ? 'lg:p-12' : prefix === 'px' ? 'lg:px-12' : prefix === 'py' ? 'lg:py-12' : prefix === 'ps' ? 'lg:ps-12' : prefix === 'pt' ? 'lg:pt-12' : prefix === 'pe' ? 'lg:pe-12' : prefix === 'pb' ? 'lg:pb-12' : prefix === 'm' ? 'lg:m-12' : prefix === 'mx' ? 'lg:mx-12' : prefix === 'my' ? 'lg:my-12' : prefix === 'ms' ? 'lg:ms-12' : prefix === 'mt' ? 'lg:mt-12' : prefix === 'me' ? 'lg:me-12' : 'lg:mb-12';
                case 'lg:16': return prefix === 'p' ? 'lg:p-16' : prefix === 'px' ? 'lg:px-16' : prefix === 'py' ? 'lg:py-16' : prefix === 'ps' ? 'lg:ps-16' : prefix === 'pt' ? 'lg:pt-16' : prefix === 'pe' ? 'lg:pe-16' : prefix === 'pb' ? 'lg:pb-16' : prefix === 'm' ? 'lg:m-16' : prefix === 'mx' ? 'lg:mx-16' : prefix === 'my' ? 'lg:my-16' : prefix === 'ms' ? 'lg:ms-16' : prefix === 'mt' ? 'lg:mt-16' : prefix === 'me' ? 'lg:me-16' : 'lg:mb-16';
                case 'lg:20': return prefix === 'p' ? 'lg:p-20' : prefix === 'px' ? 'lg:px-20' : prefix === 'py' ? 'lg:py-20' : prefix === 'ps' ? 'lg:ps-20' : prefix === 'pt' ? 'lg:pt-20' : prefix === 'pe' ? 'lg:pe-20' : prefix === 'pb' ? 'lg:pb-20' : prefix === 'm' ? 'lg:m-20' : prefix === 'mx' ? 'lg:mx-20' : prefix === 'my' ? 'lg:my-20' : prefix === 'ms' ? 'lg:ms-20' : prefix === 'mt' ? 'lg:mt-20' : prefix === 'me' ? 'lg:me-20' : 'lg:mb-20';
                case 'lg:24': return prefix === 'p' ? 'lg:p-24' : prefix === 'px' ? 'lg:px-24' : prefix === 'py' ? 'lg:py-24' : prefix === 'ps' ? 'lg:ps-24' : prefix === 'pt' ? 'lg:pt-24' : prefix === 'pe' ? 'lg:pe-24' : prefix === 'pb' ? 'lg:pb-24' : prefix === 'm' ? 'lg:m-24' : prefix === 'mx' ? 'lg:mx-24' : prefix === 'my' ? 'lg:my-24' : prefix === 'ms' ? 'lg:ms-24' : prefix === 'mt' ? 'lg:mt-24' : prefix === 'me' ? 'lg:me-24' : 'lg:mb-24';
                case 'xl:0': return prefix === 'p' ? 'xl:p-0' : prefix === 'px' ? 'xl:px-0' : prefix === 'py' ? 'xl:py-0' : prefix === 'ps' ? 'xl:ps-0' : prefix === 'pt' ? 'xl:pt-0' : prefix === 'pe' ? 'xl:pe-0' : prefix === 'pb' ? 'xl:pb-0' : prefix === 'm' ? 'xl:m-0' : prefix === 'mx' ? 'xl:mx-0' : prefix === 'my' ? 'xl:my-0' : prefix === 'ms' ? 'xl:ms-0' : prefix === 'mt' ? 'xl:mt-0' : prefix === 'me' ? 'xl:me-0' : 'xl:mb-0';
                case 'xl:1': return prefix === 'p' ? 'xl:p-1' : prefix === 'px' ? 'xl:px-1' : prefix === 'py' ? 'xl:py-1' : prefix === 'ps' ? 'xl:ps-1' : prefix === 'pt' ? 'xl:pt-1' : prefix === 'pe' ? 'xl:pe-1' : prefix === 'pb' ? 'xl:pb-1' : prefix === 'm' ? 'xl:m-1' : prefix === 'mx' ? 'xl:mx-1' : prefix === 'my' ? 'xl:my-1' : prefix === 'ms' ? 'xl:ms-1' : prefix === 'mt' ? 'xl:mt-1' : prefix === 'me' ? 'xl:me-1' : 'xl:mb-1';
                case 'xl:2': return prefix === 'p' ? 'xl:p-2' : prefix === 'px' ? 'xl:px-2' : prefix === 'py' ? 'xl:py-2' : prefix === 'ps' ? 'xl:ps-2' : prefix === 'pt' ? 'xl:pt-2' : prefix === 'pe' ? 'xl:pe-2' : prefix === 'pb' ? 'xl:pb-2' : prefix === 'm' ? 'xl:m-2' : prefix === 'mx' ? 'xl:mx-2' : prefix === 'my' ? 'xl:my-2' : prefix === 'ms' ? 'xl:ms-2' : prefix === 'mt' ? 'xl:mt-2' : prefix === 'me' ? 'xl:me-2' : 'xl:mb-2';
                case 'xl:3': return prefix === 'p' ? 'xl:p-3' : prefix === 'px' ? 'xl:px-3' : prefix === 'py' ? 'xl:py-3' : prefix === 'ps' ? 'xl:ps-3' : prefix === 'pt' ? 'xl:pt-3' : prefix === 'pe' ? 'xl:pe-3' : prefix === 'pb' ? 'xl:pb-3' : prefix === 'm' ? 'xl:m-3' : prefix === 'mx' ? 'xl:mx-3' : prefix === 'my' ? 'xl:my-3' : prefix === 'ms' ? 'xl:ms-3' : prefix === 'mt' ? 'xl:mt-3' : prefix === 'me' ? 'xl:me-3' : 'xl:mb-3';
                case 'xl:4': return prefix === 'p' ? 'xl:p-4' : prefix === 'px' ? 'xl:px-4' : prefix === 'py' ? 'xl:py-4' : prefix === 'ps' ? 'xl:ps-4' : prefix === 'pt' ? 'xl:pt-4' : prefix === 'pe' ? 'xl:pe-4' : prefix === 'pb' ? 'xl:pb-4' : prefix === 'm' ? 'xl:m-4' : prefix === 'mx' ? 'xl:mx-4' : prefix === 'my' ? 'xl:my-4' : prefix === 'ms' ? 'xl:ms-4' : prefix === 'mt' ? 'xl:mt-4' : prefix === 'me' ? 'xl:me-4' : 'xl:mb-4';
                case 'xl:5': return prefix === 'p' ? 'xl:p-5' : prefix === 'px' ? 'xl:px-5' : prefix === 'py' ? 'xl:py-5' : prefix === 'ps' ? 'xl:ps-5' : prefix === 'pt' ? 'xl:pt-5' : prefix === 'pe' ? 'xl:pe-5' : prefix === 'pb' ? 'xl:pb-5' : prefix === 'm' ? 'xl:m-5' : prefix === 'mx' ? 'xl:mx-5' : prefix === 'my' ? 'xl:my-5' : prefix === 'ms' ? 'xl:ms-5' : prefix === 'mt' ? 'xl:mt-5' : prefix === 'me' ? 'xl:me-5' : 'xl:mb-5';
                case 'xl:6': return prefix === 'p' ? 'xl:p-6' : prefix === 'px' ? 'xl:px-6' : prefix === 'py' ? 'xl:py-6' : prefix === 'ps' ? 'xl:ps-6' : prefix === 'pt' ? 'xl:pt-6' : prefix === 'pe' ? 'xl:pe-6' : prefix === 'pb' ? 'xl:pb-6' : prefix === 'm' ? 'xl:m-6' : prefix === 'mx' ? 'xl:mx-6' : prefix === 'my' ? 'xl:my-6' : prefix === 'ms' ? 'xl:ms-6' : prefix === 'mt' ? 'xl:mt-6' : prefix === 'me' ? 'xl:me-6' : 'xl:mb-6';
                case 'xl:8': return prefix === 'p' ? 'xl:p-8' : prefix === 'px' ? 'xl:px-8' : prefix === 'py' ? 'xl:py-8' : prefix === 'ps' ? 'xl:ps-8' : prefix === 'pt' ? 'xl:pt-8' : prefix === 'pe' ? 'xl:pe-8' : prefix === 'pb' ? 'xl:pb-8' : prefix === 'm' ? 'xl:m-8' : prefix === 'mx' ? 'xl:mx-8' : prefix === 'my' ? 'xl:my-8' : prefix === 'ms' ? 'xl:ms-8' : prefix === 'mt' ? 'xl:mt-8' : prefix === 'me' ? 'xl:me-8' : 'xl:mb-8';
                case 'xl:10': return prefix === 'p' ? 'xl:p-10' : prefix === 'px' ? 'xl:px-10' : prefix === 'py' ? 'xl:py-10' : prefix === 'ps' ? 'xl:ps-10' : prefix === 'pt' ? 'xl:pt-10' : prefix === 'pe' ? 'xl:pe-10' : prefix === 'pb' ? 'xl:pb-10' : prefix === 'm' ? 'xl:m-10' : prefix === 'mx' ? 'xl:mx-10' : prefix === 'my' ? 'xl:my-10' : prefix === 'ms' ? 'xl:ms-10' : prefix === 'mt' ? 'xl:mt-10' : prefix === 'me' ? 'xl:me-10' : 'xl:mb-10';
                case 'xl:12': return prefix === 'p' ? 'xl:p-12' : prefix === 'px' ? 'xl:px-12' : prefix === 'py' ? 'xl:py-12' : prefix === 'ps' ? 'xl:ps-12' : prefix === 'pt' ? 'xl:pt-12' : prefix === 'pe' ? 'xl:pe-12' : prefix === 'pb' ? 'xl:pb-12' : prefix === 'm' ? 'xl:m-12' : prefix === 'mx' ? 'xl:mx-12' : prefix === 'my' ? 'xl:my-12' : prefix === 'ms' ? 'xl:ms-12' : prefix === 'mt' ? 'xl:mt-12' : prefix === 'me' ? 'xl:me-12' : 'xl:mb-12';
                case 'xl:16': return prefix === 'p' ? 'xl:p-16' : prefix === 'px' ? 'xl:px-16' : prefix === 'py' ? 'xl:py-16' : prefix === 'ps' ? 'xl:ps-16' : prefix === 'pt' ? 'xl:pt-16' : prefix === 'pe' ? 'xl:pe-16' : prefix === 'pb' ? 'xl:pb-16' : prefix === 'm' ? 'xl:m-16' : prefix === 'mx' ? 'xl:mx-16' : prefix === 'my' ? 'xl:my-16' : prefix === 'ms' ? 'xl:ms-16' : prefix === 'mt' ? 'xl:mt-16' : prefix === 'me' ? 'xl:me-16' : 'xl:mb-16';
                case 'xl:20': return prefix === 'p' ? 'xl:p-20' : prefix === 'px' ? 'xl:px-20' : prefix === 'py' ? 'xl:py-20' : prefix === 'ps' ? 'xl:ps-20' : prefix === 'pt' ? 'xl:pt-20' : prefix === 'pe' ? 'xl:pe-20' : prefix === 'pb' ? 'xl:pb-20' : prefix === 'm' ? 'xl:m-20' : prefix === 'mx' ? 'xl:mx-20' : prefix === 'my' ? 'xl:my-20' : prefix === 'ms' ? 'xl:ms-20' : prefix === 'mt' ? 'xl:mt-20' : prefix === 'me' ? 'xl:me-20' : 'xl:mb-20';
                case 'xl:24': return prefix === 'p' ? 'xl:p-24' : prefix === 'px' ? 'xl:px-24' : prefix === 'py' ? 'xl:py-24' : prefix === 'ps' ? 'xl:ps-24' : prefix === 'pt' ? 'xl:pt-24' : prefix === 'pe' ? 'xl:pe-24' : prefix === 'pb' ? 'xl:pb-24' : prefix === 'm' ? 'xl:m-24' : prefix === 'mx' ? 'xl:mx-24' : prefix === 'my' ? 'xl:my-24' : prefix === 'ms' ? 'xl:ms-24' : prefix === 'mt' ? 'xl:mt-24' : prefix === 'me' ? 'xl:me-24' : 'xl:mb-24';
                default: return '';
            }
        });
    };
    
    // Helper function to convert alignment to Tailwind class
    const toTailwindAlign = (align: BlockXAlignmentType): string => {
        switch (align) {
            case 'start': return 'items-start';
            case 'end': return 'items-end';
            case 'center': return 'items-center';
            case 'sm:start': return 'sm:items-start';
            case 'sm:end': return 'sm:items-end';
            case 'sm:center': return 'sm:items-center';
            case 'md:start': return 'md:items-start';
            case 'md:end': return 'md:items-end';
            case 'md:center': return 'md:items-center';
            case 'lg:start': return 'lg:items-start';
            case 'lg:end': return 'lg:items-end';
            case 'lg:center': return 'lg:items-center';
            case 'xl:start': return 'xl:items-start';
            case 'xl:end': return 'xl:items-end';
            case 'xl:center': return 'xl:items-center';
            default: return '';
        }
    };
    
    // Helper function for hero padding (matching the CSS file values)
    const getHeroPadding = (level: string): string => {
        switch (level) {
            case '0': return 'py-4 px-4 md:py-8 md:px-4';
            case '1': return 'py-8 px-4 md:py-16 md:px-8';
            case '2': return 'py-12 px-4 md:py-24 md:px-12';
            case '3': return 'py-16 px-4 md:py-32 md:px-16';
            default: return '';
        }
    };
    
    const alignArray: BlockXAlignmentType[] | undefined = Array.isArray(blockXAlign) 
        ? blockXAlign 
        : (blockXAlign != undefined ? ((blockXAlign as string).split(" ") as BlockXAlignmentType[]) : undefined);
    
    return (
        <div className={clsx(
            className,
            paddingHero != undefined && getHeroPadding(paddingHero),
            toTailwindSpacing('p', padding),
            toTailwindSpacing('px', paddingX),
            toTailwindSpacing('py', paddingY),
            toTailwindSpacing('ps', paddingStart),
            toTailwindSpacing('pt', paddingTop),
            toTailwindSpacing('pe', paddingEnd),
            toTailwindSpacing('pb', paddingBottom),
            toTailwindSpacing('m', margin),
            toTailwindSpacing('mx', marginX),
            toTailwindSpacing('my', marginY),
            toTailwindSpacing('ms', marginStart),
            toTailwindSpacing('mt', marginTop),
            toTailwindSpacing('me', marginEnd),
            marginBottom != undefined ? toTailwindSpacing('mb', marginBottom) : "mb-3",
            // flex column so that items are aligned in a column
            alignArray != undefined && alignArray.map(toTailwindAlign),
            blockXAlign != undefined && 'flex flex-col',
            textAlign && `text-${textAlign}`
        )}
             style={{...(maxWidth && {maxWidth: maxWidth}), ...style}}
             {...rest}>
            {children}
        </div>
    );
}
