'use client'

import * as React from "react"
import {Moon, Sun} from "lucide-react"

import {Button} from "@/components/ui/button"

// noinspection JSUnusedGlobalSymbols - distributed
export default function ModeToggle() {
    const [theme, setThemeState] = React.useState<
        "theme-light" | "dark"
    >("theme-light")

    React.useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark")
        setThemeState(isDarkMode ? "dark" : "theme-light")
    }, [])

    React.useEffect(() => {
        const isDark = theme === "dark"
        document.documentElement.classList[isDark ? "add" : "remove"]("dark")
    }, [theme])

    const toggleTheme = () => {
        setThemeState(theme === "theme-light" ? "dark" : "theme-light")
    }

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"/>
            <Moon
                className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"/>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
