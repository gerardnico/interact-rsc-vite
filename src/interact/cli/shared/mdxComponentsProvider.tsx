import type {MDXComponents} from 'mdx/types.js'
import Code from "../../components/Code/Code.js";


/**
 * MDXComponents represents the components prop.
 * MDX will call this function to resolve components
 * See https://mdxjs.com/guides/injecting-components/
 */
export function useMDXComponents(): MDXComponents {
    return {
        p:  ({ children }) => <p className="my-4">{children}</p>,
        Planet() {
            return 'Pluto'
        },
        h1(properties:React.HTMLAttributes<HTMLHeadingElement>) {
            return <h1 {...properties} className="custom"/>
        },
        pre: Code
    }
}