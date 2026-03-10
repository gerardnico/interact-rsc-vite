import React from "react";
import clsx from "clsx";


export default function Table({children, className, ...rest}: React.TableHTMLAttributes<HTMLTableElement>) {


    return (
        <table className={clsx(
            className,
            "inline table table-non-fluid table-hover table-striped"
        )} {...rest}>{children}</table>
    )

}
