'use client'

import React, {createContext, type ReactNode, useContext} from "react";
import type {SearchProviderInterface} from "interact:search-provider";
import SearchProvider from "interact:search-provider";


const SearchProviderContext = createContext<SearchProviderInterface | null>(null);
type OpenState = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
const SearchOpenContext = React.createContext<OpenState>([false, () => {
}])

export function useSearchOpenState(): OpenState {
    const ctx = React.useContext(SearchOpenContext)
    if (!ctx) {
        /**
         * In server rendering
         */
        if (typeof window === 'undefined') {
            return [
                false,
                () => {
                }
            ]
        }
        throw new Error("useSearchOpenState must be used within SearchOpenContext")
    }
    return ctx
}

export function useSearchProvider() {
    const ctx = useContext(SearchProviderContext);
    if (!ctx) {
        /**
         * In server rendering
         */
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
    const provider = new SearchProvider();

    return (
        <SearchProviderContext.Provider value={provider}>
            <SearchOpenContext.Provider value={openState}>
                {children}
            </SearchOpenContext.Provider>
        </SearchProviderContext.Provider>
    )
}

