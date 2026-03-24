// noinspection JSUnusedGlobalSymbols

/**
 * Just an example of what should be generated
 */
import type {MDXComponents} from 'mdx/types.js'
import Code from "@combostrap/interact/components/Code";
import Holy from "@combostrap/interact/components/Holy";
import type {ComponentType} from "react";
import type {TemplateProps} from "@combostrap/interact/types";
import Landing from "@combostrap/interact/components/Landing";
import Html from "@combostrap/interact/components/Html";
import Head from "@combostrap/interact/components/Head";
import Svg from "@combostrap/interact/components/Svg";

const layoutComponents: Record<string, ComponentType<TemplateProps>> = {
    holy: Holy,
    landing: Landing,
};

/**
 * useMDXComponents is used by Mdx
 * where MDXComponents represents the components prop.
 * MDX will call this function to resolve components
 * See https://mdxjs.com/guides/injecting-components/
 */
export function useMDXComponents(): MDXComponents {

    return {
        Planet() {
            return 'Pluto'
        },
        // @ts-ignore
        pre: Code,
        Svg: Svg
    }
}

export function getLayoutComponent(name: string): ComponentType<TemplateProps> | undefined {
    return layoutComponents[name.toLowerCase()];
}

export {Code, Holy, Landing, Head, Html}

// to not return null
const defaultComponent = ()=> "Don't use the default export";
export default defaultComponent