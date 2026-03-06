/**
 * Shared code between client and server (handler)
 */
import {z} from "zod";
import {ImageError, ImageErrors} from "./imageErrorsDictionary.js";
import {ImageFitSchema} from "../config/jsonConfigSchema.js";
import sharp, {type FitEnum, type FormatEnum} from "sharp";
import {getPresetOptions, type ImageCompressionType} from "./imageCompressionType.js";

/**
 * Key Properties on the image service URL
 */
export const urlKeyErrorProperty = "error"
export const urlKeyWidthProperty = "width"
export const urlKeyHeightProperty = "height"
export const urlKeyCompressionProperty = "compression"
export const urlKeyFormatProperty = "format"
export const urlKeyRatioProperty = "ratio"
export const urlKeyFitProperty = "fit"

export type ImageServiceKeyUrl = "error" | "width" | "height" | "compression" | "fit" | "ratio"
/**
 * The broken image
 */
export const brokenImage = "broken-heart.svg"

const ImageWidthSchema = z.coerce.number().int().positive().describe("A image width should have a positive integer value").nullable().optional();
const ImageHeightSchema = z.coerce.number().int().positive().describe("A image height should have a positive integer value").nullable().optional();


export function castWidthToNumber(width: string | null | undefined | number): number | null {
    if (width == null) return null;
    try {
        return ImageWidthSchema.parse(width) || null;
    } catch (e) {
        throw new ImageError({message: `bad width value ${width}: ${e}`, ...ImageErrors.BAD_WIDTH});
    }
}

export function castFit(fit: string | null | undefined | number): keyof FitEnum {
    try {
        return ImageFitSchema.parse(fit) as unknown as keyof FitEnum;
    } catch (e) {
        throw new ImageError({message: `bad fit value ${fit}: ${e}`, ...ImageErrors.BAD_WIDTH});
    }
}

export function castHeightToNumber(rawHeight: string | null | undefined | number): number | null {
    if (rawHeight == null) return null;
    try {
        return ImageHeightSchema.parse(rawHeight) || null;
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

export async function processImageWithSharp({
    sharpPipeline,
    targetWidth,
    targetHeight,
    requestedFit,
    requestedFormat,
    requestedCompression
}: {
    sharpPipeline: sharp.Sharp,
    targetWidth: number,
    targetHeight: number,
    requestedFit: keyof FitEnum,
    requestedFormat: keyof FormatEnum,
    requestedCompression: ImageCompressionType
}): Promise<Buffer> {


    /**
     * When fit is contain, the created margin are black
     * We make them transparent
     */
    let background;
    let outputFormat = requestedFormat;
    if (requestedFit == 'contain') {
        const transparentFormatSupport = ["webp", "png"]
        if (!transparentFormatSupport.includes(requestedFormat)) {
            outputFormat = "webp"
        }
        background = {r: 0, g: 0, b: 0, alpha: 0}// transparent
    }

    sharpPipeline = sharpPipeline.resize({
        width: targetWidth,
        height: targetHeight,
        fit: requestedFit,
        withoutEnlargement: true,
        background: background
    });

    const options = getPresetOptions({compression: requestedCompression, format: outputFormat});
    sharpPipeline.toFormat(outputFormat, options)
    return await sharpPipeline.toBuffer();
}
