'use client'

import {useState} from "react";
import {cn} from "../lib/utils.js";
import {ModeToggle} from "@/components/ModeToggle.js";

export function NavBarCollapse({children, className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
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

            {/* Collapsible content at md */}
                <div
                    className={
                        cn(
                            "grow basis-full md:flex gap-2",
                            isOpen ? "" : "hidden",
                            className
                        )}
                    style={{
                        alignItems: "flex-end",
                        flexDirection: "row",
                    }}
                    {...props}>
                    {children}
                    <ModeToggle/>
                </div>
        </>
    )

}