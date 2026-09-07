/**
 * The fallback component
 * What is printed when an error occurs
 * @param error
 * @constructor
 */
import type {FallBackProps} from "@/components/interact/ErrorBoundary.tsx";
import {Errory} from "@/lib/Errory.ts";
import React from "react";


export function ErrorFallback({error, reset}: FallBackProps) {

    const errorObject = new Errory(error);
    return (
        <html>
        <head>
            <title>Interact Unexpected Error</title>
        </head>
        <body
            style={{
                fontFamily:
                    'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                height: '100vh',
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                placeContent: 'center',
                placeItems: 'center',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '28px',
            }}
        >
        <div>Interact Caught an unexpected error</div>
        <div>
            <h1 className={'text-danger'}>Error</h1>
            <p>Sorry, an unexpected fatal error has occurred.</p>
            <h2>Message</h2>
            <div className={'border rounded p-3 mb-3'}>
                {errorObject.getMessage()}
            </div>
            {import.meta.env.DEV &&
                (
                    <div className={'mt-5'}>
                        <h2>Dev Technical information</h2>
                        <p><b>Stack Trace</b></p>
                        <div className={'border rounded p-3 mb-3'}>
                            {errorObject.getStackTrace()}
                        </div>
                        <p><b>Error Object as Json:</b></p>
                        <div className={'border rounded p-3 mb-3'}>
                            {errorObject.getAsJson()}
                        </div>
                    </div>
                )}
        </div>
        <button
            onClick={() => {
                React.startTransition(() => {
                    reset()
                })
            }}
        >
            Reset
        </button>
        </body>
        </html>


    )
}
