import React from "react";
import clsx from "clsx";

// line height inside a paragraph
// https://getbootstrap.com/docs/5.0/utilities/text/#line-height
// with br, it will
type LineHeightType = "1" | "sm" | "base" | "lg";

export type ParaType = React.HTMLAttributes<HTMLParagraphElement> & {
    lineHeight?: LineHeightType
}

/**
 * A paragraph
 */
export default function Para({children, lineHeight, className, ...rest}: ParaType) {

    return (
        <p className={clsx(
            className,
            lineHeight && `lh-${lineHeight}`
        )}
              {...rest}>
            {children}
        </p>
    )

}
