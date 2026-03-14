import React from "react";


export default function Table({children, className, ...rest}: React.TableHTMLAttributes<HTMLTableElement>) {

    if (className == null) {
        className = "inline table table-non-fluid table-hover table-striped"
    }
    return (
        <table className={className} {...rest}>{children}</table>
    )

}
