import React from "react";
import type {LayoutProps} from "@combostrap/interact/types";

interface LocaleWithTextInfo extends Intl.Locale {
    textInfo?: { direction: 'ltr' | 'rtl' };
}

export type HtmlProps = React.HtmlHTMLAttributes<HTMLHtmlElement> & LayoutProps & {
    lang?: string
};

// noinspection JSUnusedGlobalSymbols - imported via exports
export default async function Html({page, context, ...props}: HtmlProps) {

    let lang = "en";
    if (props.lang) {
        lang = props.lang;
    } else {
        let frontmatterLang = page.frontmatter?.lang;
        if (frontmatterLang != null) {
            lang = frontmatterLang;
        }
    }
    // Node only ???
    const locale = new Intl.Locale(lang) as LocaleWithTextInfo;
    const direction = locale.textInfo?.direction ?? 'ltr';

    return (
        <html lang={lang} dir={direction} {...props}>
        {props.children}
        </html>
    )
}