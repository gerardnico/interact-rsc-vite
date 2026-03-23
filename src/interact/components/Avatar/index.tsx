// An avatar image props
// That set the following properties automatically
// * Making it round: `border-radius: 50%` or `rounded-circle` class in bs turns it into a circle. This only works well when width and height are equal (a square).
// *  Covering the frame — `object-fit: cover` ensures the image fills the square without distortion, cropping from the center if needed.
import clsx from "clsx";
import Image, {type ImageProps} from '@combostrap/interact/components/Image';
import {InteractError, InteractErrorData} from "../../errors/index.js";

// noinspection JSUnusedGlobalSymbols - exported at the package level
export type AvatarType = ImageProps & {
    size: number | string
}

/**
 * Size because width and height should be the same
 */
// noinspection JSUnusedGlobalSymbols - exported at the package level
export default async function Avatar({size, width, height, className, ...props}: AvatarType) {

    if (width) {
        if (height) {
            if (width != height) {
                throw new InteractError(InteractErrorData.AvatarIncorrectDimension)
            }
        }
        size = width
    } else if (height) {
        if (width) {
            if (width != height) {
                throw new InteractError(InteractErrorData.AvatarIncorrectDimension)
            }
        }
        size = height
    }

    return (
        <Image
            width={size}
            height={size}
            className={clsx(className, "rounded-circle")}
            fit="cover"
            style={{objectFit: "cover"}}
            {...props}
        />
    )
}

