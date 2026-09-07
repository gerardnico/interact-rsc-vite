'use client'

import {createContext, type ReactNode, useContext} from "react";
import type {SearchProvider} from "@combostrap/interact/types";
import PageFind from "@/search/pagefind/pagefind-browser.ts";

const SearchProviderContext = createContext<SearchProvider | null>(null);

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
    const provider = new PageFind();

    return (
        <SearchProviderContext.Provider value={provider}>
            {children}
        </SearchProviderContext.Provider>
    )
}

