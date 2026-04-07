/**
 * Entry point of the App
 * so that this CSS are first and loaded before any components
 * Because in Rsc environment, the imported CSS are loaded first
 * and may interfere with the CSS layer if seen first
 */

import {type ReactNode} from "react";
import "interact:global.css"
import "interact:outline-numbering.css"

type AppProps = {
    children: ReactNode;
};

export default function InteractApp({children}: AppProps) {
    return <>{children}</>;
}