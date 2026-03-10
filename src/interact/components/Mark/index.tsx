import React from "react";

/**
 * This component was created to map the `code` element of Markdown
 * to the mark element (highlight)
 */
export default function Mark({children, ...rest}: React.HTMLAttributes<HTMLElement>) {

    return (
        <mark {...rest}>{children}</mark>
    )

}
