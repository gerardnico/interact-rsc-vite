'use client'

import type {ReactNode} from "react";
import ErrorBoundary from "@/components/interact/ErrorBoundary.tsx";
import {ErrorFallback} from "@/components/interact/ErrorFallback.tsx";

// noinspection JSUnusedGlobalSymbols - vite virtual provider reads it
export default function ErrorContext({children}: { children: ReactNode }) {

    return (
        <ErrorBoundary fallback={ErrorFallback}>
            {children}
        </ErrorBoundary>
    )

}