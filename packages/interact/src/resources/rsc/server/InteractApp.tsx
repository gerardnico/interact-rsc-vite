/**
 * Entry point of the App on the server side
 * so that this CSS are first and loaded before any components
 * Because in Rsc environment, the imported CSS are loaded first
 * and may interfere with the CSS layer if seen first
 */

import {type ReactNode} from "react";
import "interact:global.css"
import {getContextComponents} from "interact:server-contexts";

type AppProps = {
    children: ReactNode;
};

export default function InteractApp({children}: AppProps) {
    let root = children;
    for (const ContextComponent of Object.values(getContextComponents())) {
        root = (
            <ContextComponent>
                {root}
            </ContextComponent>
        )
    }
    return root;
}