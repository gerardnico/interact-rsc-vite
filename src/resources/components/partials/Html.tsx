import type {ContextProps} from "@combostrap/interact/types";
import React from "react";

interface LocaleWithTextInfo extends Intl.Locale {
    textInfo?: { direction: 'ltr' | 'rtl' };
}

export type HtmlProps = React.HtmlHTMLAttributes<HTMLHtmlElement> & ContextProps;

// noinspection JSUnusedGlobalSymbols - imported via exports
export default async function Html({request, page, ...props}: HtmlProps) {

    let lang = "en";
    if (props.lang) {
        lang = props.lang;
    } else {
        let frontmatterLang = page?.frontmatter?.lang;
        if (frontmatterLang != null) {
            lang = frontmatterLang;
        }
    }
    const locale = new Intl.Locale(lang) as LocaleWithTextInfo;
    const direction = locale.textInfo?.direction ?? 'ltr';

    return (
        <html lang={lang} dir={direction} {...props}>
        {props.children}
        </html>
    )
}