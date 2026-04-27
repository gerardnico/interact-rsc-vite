import type {LayoutProps} from "@combostrap/interact/types";
import {getInteractConfig} from "@combostrap/interact/config";

// @ts-ignore - A placeholder
export default async function Footer(layoutProps: LayoutProps) {
    let interactConfig = getInteractConfig();
    return (
        <div className={interactConfig.template.container.containerClass}/>
    )
}