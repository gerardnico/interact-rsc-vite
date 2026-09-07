'use client'

import React, {createContext, type ReactNode, useContext} from "react";
import type {SearchProvider} from "@combostrap/interact/types";
import PageFind from "@/search/pagefind/pagefind-browser.ts";

const SearchProviderContext = createContext<SearchProvider | null>(null);
type OpenState = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
const SearchOpenContext = React.createContext<OpenState>([false, () => {
}])

export function useSearchOpenState(): OpenState {
    const ctx = React.useContext(SearchOpenContext)
    if (!ctx) {
        if (typeof window === 'undefined') {
            return [
                false,
                () => {
                }
            ]
        }
        throw new Error("useSearchOpen must be used within CommandListProvider")
    }
    return ctx
}

export function useSearchProvider() {
    const ctx = useContext(SearchProviderContext);
    if (!ctx) {
        if (typeof window === 'undefined') {
            return null
        }
        throw new Error("No search provider in context");
    }
    return ctx;
}


// noinspection JSUnusedGlobalSymbols - read dynamically
export default function SearchContext({children}: {
    children: ReactNode
}) {
    const openState = React.useState(false)
    const provider = new PageFind();

    return (
        <SearchProviderContext.Provider value={provider}>
            <SearchOpenContext.Provider value={openState}>
                {children}
            </SearchOpenContext.Provider>
        </SearchProviderContext.Provider>
    )
}

