'use client'

import {useState} from "react";
import {cn} from "../../styling/cnUtil.js";

export function NavBarToggle() {
    const [isOpen, setIsOpen] = useState(false);

    let hamburgerLine: React.CSSProperties = {
        display: "block",
        width: "22px",
        height: "2px",
        background: "var(--primary)",
        borderRadius: "2px",
        transition: "transform 0.2s, opacity 0.2s"
    }

    let toggleButton: React.CSSProperties = {
        gap: "5px",
        padding: "4px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        borderRadius: "4px"
    }

    return (
        <>
            {/* Hamburger (mobile only) */}
            <button
                id="nav-toggle"
                style={toggleButton}
                className="md:hidden flex flex-col"
                aria-label="Toggle navigation"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span style={{
                    ...hamburgerLine,
                    ...(isOpen ? {
                        transform: "translateY(7px) rotate(45deg)"
                    } : {})
                }}/>
                <span style={
                    {
                    ...hamburgerLine,
                    ...(isOpen ? {opacity: "0"} : {})
                    }
                }/>
                <span style={{
                    ...hamburgerLine,
                    ...(isOpen ? {
                        transform: "translateY(-7px) rotate(-45deg)"
                    } : {})
                }}/>
            </button>

            {/* Collapsible content */}
            <div id="nav-menu" className={
                cn("grow basis-full items-center md:flex gap-2", isOpen ? "" : "hidden")
            }>
                <a href="#" className="block py-1 text-primary-700 hover:text-blue-600">Todo</a>
                <a href="#" className="block py-1 text-primary-700 hover:text-blue-600">Todo</a>
                <a href="#" className="block py-1 text-primary-700 hover:text-blue-600">Todo</a>
            </div>
        </>
    )

}