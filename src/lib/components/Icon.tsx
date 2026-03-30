import Svg, {type SvgComponentProps} from "./Svg.js";
import clsx from "clsx";

/**
 * A svg wrapper that adds an inline
 * because they are by default considered a block and not a text
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default async function Icon({
                                       className,
                                       ...svgProps
                                   }: SvgComponentProps) {
    return <Svg className={clsx("inline", className)} {...svgProps}/>
}