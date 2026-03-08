/**
 * Just an example of what should be generated
 */
import type {MDXComponents} from 'mdx/types.js'
import Code from "#components/Code";
import Holy from "#components/Holy";

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

export {Code, Holy}