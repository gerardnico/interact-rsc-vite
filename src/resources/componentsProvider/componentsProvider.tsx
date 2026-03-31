// noinspection JSUnusedGlobalSymbols
/**
 * Just an example of what should be generated
 * as components provider
 */
import type {MDXComponents} from 'mdx/types.js'
import Code from "@combostrap/interact/components/Code";
import Svg from "@combostrap/interact/components/Svg";


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


export {Code}

// to not return null
const defaultComponent = () => "Don't use the default export";
export default defaultComponent