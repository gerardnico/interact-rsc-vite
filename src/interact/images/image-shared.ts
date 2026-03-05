/**
 * Shared code between client and server (handler)
 */
import {z} from "zod";
import {ImageError, ImageErrors} from "./image-errors-dictionary";

/**
 * Key Properties on the image service URL
 */
export const urlKeyErrorProperty = "error"
export const urlKeyWidthProperty = "width"
export const urlKeyHeightProperty = "height"
export const urlKeyCompressionProperty = "compression"
export const urlKeyFormatProperty = "format"
export const urlKeyRatioProperty = "ratio"

/**
 * The broken image
 */
export const brokenImage = "broken-heart-landscape.svg"

const widthSchema = z.coerce.number().int().positive().describe("A image width should have a positive integer value").nullable().optional();
const heightSchema = z.coerce.number().int().positive().describe("A image height should have a positive integer value").nullable().optional();

export function castWidthToNumber(width: string | null | undefined | number): number | null | undefined {
    if (width == null) return null;
    try {
        return widthSchema.parse(width);
    } catch (e) {
        throw new ImageError({message: `bad width value ${width}: ${e}`, ...ImageErrors.BAD_WIDTH});
    }
}

export function castHeightToNumber(rawHeight: string | null | undefined | number): number | null | undefined {
    if (rawHeight == null) return null;
    try {
        return heightSchema.parse(rawHeight);
    } catch (e) {
        throw new ImageError({message: `bad height value ${rawHeight}: ${e}`, ...ImageErrors.BAD_HEIGHT});
    }
}

/**
 * Convert 16:9, ... to a float
 * @returns The ratio as a float
 * @throws Error if the ratio string is invalid
 */
export function castRatioToNumber(stringRatio: string | null | undefined): number | null {
    if (stringRatio == null) {
        return null;
    }
    const [widthStr, heightStr] = stringRatio.split(":", 2);

    const width = parseInt(widthStr, 10);
    if (isNaN(width)) {
        throw new ImageError({
                message: `The width value (${widthStr}) of the ratio \`${stringRatio}\` is not numeric`,
                ...ImageErrors.BAD_RATIO
            }
        );
    }

    const height = parseInt(heightStr, 10);
    if (isNaN(height)) {
        throw new ImageError({
                message: `The height value (${heightStr}) of the ratio \`${stringRatio}\` is not numeric`,
                ...ImageErrors.BAD_RATIO
            }
        );
    }

    if (height === 0) {
        throw new ImageError(
            {
                message: `The height value of the ratio \`${stringRatio}\` should not be zero`,
                ...ImageErrors.BAD_RATIO
            }
        );
    }

    return width / height;
}