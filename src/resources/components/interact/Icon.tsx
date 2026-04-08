import Svg, {type SvgComponentProps} from "./Svg";
import clsx from "clsx";

/**
 * A svg wrapper that adds an inline
 * because they are by default considered a block and not a text
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default async function Icon({
                                       className,
                                       size = 24,
                                       height,
                                       width,
                                       ...svgProps
                                   }: SvgComponentProps & { size?: number }) {
    if (height == null) {
        height = size;
    }
    if (width == null) {
        width = size;
    }
    return <Svg className={clsx("inline", className)} width={width} height={height} {...svgProps}/>
}