import Svg, {type SvgComponentProps} from "./Svg";
import clsx from "clsx";


/**
 * A svg wrapper that adds an inline
 * because they are by default considered a block and not a text
 * In an HTML page, the size is generally controlled externally with class.
 * Because an icon is generally a square, we give the size attribute so that
 * the author may give only one dimension
 **/
/// noinspection JSUnusedGlobalSymbols - imported dynamically
export default async function Icon({
                                       className,
                                       size,
                                       ...svgProps
                                   }: SvgComponentProps & { size?: number }) {

    // icon is class that we have defined as tailwind utility
    return <Svg
        className={clsx("icon", className)}
        {...svgProps}
        {...(size != null ? {width: size, height: size} : {})}
    />
}