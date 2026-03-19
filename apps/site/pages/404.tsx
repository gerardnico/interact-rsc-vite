// noinspection JSUnusedGlobalSymbols - imported dynamically

import type {Frontmatter} from "@combostrap/interact/types";
// @ts-ignore -- not under rootDir, we know
import GoBackButton from "../components/ButtonGoBack.js";
import Block from "@combostrap/interact/components/Block";
import {getInteractConfig} from "@combostrap/interact/config";

export const frontmatter: Frontmatter = {
    layout: "hamburger",
    title: "Page not found"
}

const styles: Record<string, React.CSSProperties> = {
    buttons: {
        margin: ".25rem .125rem"
    }
}
export default function NotFound404() {

    return (

        <Block blockXAlign={["center"]} marginTop={["5"]}>

            <Block maxWidth={"600px"}>
                <div className="badge text-bg-secondary">HTTP Error - 404 - Page Not Found</div>

                <div className="divider"></div>

                <h1 className={"mt-5"}>This page has <em>gone missing</em></h1>
                <p className={"mt-5"}>
                    The page or resource you requested could not be found on this server.<br/>
                    It may have been moved, renamed, or deleted.
                </p>

                <div className={"mt-5"}>
                    <a href={getInteractConfig().site.base} className="btn btn-primary" style={styles['buttons']}>← Back
                        to home</a>
                    <GoBackButton className="btn btn-secondary" style={styles['buttons']}>Go back</GoBackButton>
                </div>

            </Block>
        </Block>

    )

}
