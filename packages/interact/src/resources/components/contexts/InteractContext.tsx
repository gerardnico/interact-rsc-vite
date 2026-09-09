'use client'

import type {ReactNode} from "react";
import ErrorContext from "./ErrorContext.js";
import SearchContext from "@/components/contexts/SearchContext.tsx";
import ClientConfigContext from "./ClientConfigContext.js";


// noinspection JSUnusedGlobalSymbols - vite virtual provider reads it
export default function InteractContext({children}: { children: ReactNode }) {

    return (
        <ClientConfigContext>
            <ErrorContext>
                <SearchContext>
                    {children}
                </SearchContext>
            </ErrorContext>
        </ClientConfigContext>
    )

}