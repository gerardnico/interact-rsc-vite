import React from "react";


/**
 * The equivalent of a row
 * https://getbootstrap.com/docs/5.3/layout/grid/#row-columns
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function GridCell({
                                     children,
                                     className,
                                     ...rest
                                 }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
    return (
        <div
            className={className ? className : "cell"}
            {...rest}>
            {children}
        </div>
    );
}