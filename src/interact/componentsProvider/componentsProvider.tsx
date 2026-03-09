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
        p: ({children}) => <p className="my-4">{children}</p>,
        Planet() {
            return 'Pluto'
        },
        h1(properties: React.HTMLAttributes<HTMLHeadingElement>) {
            return <h1 {...properties} className="custom"/>
        },
        pre: Code
    }
}

export function getLayoutComponent(name: string): ComponentType<TemplateProps> | undefined {
    return layoutComponents[name.toLowerCase()];
}

export {Code, Holy}