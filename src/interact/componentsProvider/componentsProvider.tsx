// noinspection JSUnusedGlobalSymbols

/**
 * Just an example of what should be generated
 */
import type {MDXComponents} from 'mdx/types.js'
import Code from "#components/Code";
import Holy from "#components/Holy";
import type {ComponentType} from "react";
import type {TemplateProps} from "./templateComponent.js";
import Landing from "#components/Landing";
import Svg from "#components/Svg";

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

export {Code, Holy}