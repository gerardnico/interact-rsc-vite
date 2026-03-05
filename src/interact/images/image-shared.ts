/**
 * Shared code between client and server (handler)
 */
import {z} from "zod";

const widthSchema = z.coerce.number().int().positive().describe("A image width should have a positive integer value").nullable().optional();
const heightSchema = z.coerce.number().int().positive().describe("A image height should have a positive integer value").nullable().optional();

export function castWidthToNumber(width: string | null | undefined | number): number | null | undefined {
    if (width == null) return null;
    try {
        return widthSchema.parse(width);
    } catch (e) {
        throw new ImageError(`bad width value ${width}: ${e}`, 400, "Bad width requested");
    }
}

export function castHeightToNumber(rawHeight: string | null | undefined | number): number | null | undefined {
    if (rawHeight == null) return null;
    try {
        return heightSchema.parse(rawHeight);
    } catch (e) {
        throw new ImageError(`bad height value ${rawHeight}: ${e}`, 400, 'Bad height requested');
    }
}

export class ImageError extends Error {
    message: string;
    statusCode: number;
    errorName: string | undefined;

    constructor(message: string, statusCode: number, errorName?: string) {
        super(message);
        this.name = 'ImageHandlerError';
        this.message = message;
        this.statusCode = statusCode;
        this.errorName = errorName;
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
        throw new ImageError(
            `The width value (${widthStr}) of the ratio \`${stringRatio}\` is not numeric`,
            400,
            'Bad ratio requested (width)'
        );
    }

    const height = parseInt(heightStr, 10);
    if (isNaN(height)) {
        throw new ImageError(
            `The height value (${heightStr}) of the ratio \`${stringRatio}\` is not numeric`,
            400,
            'Bad ratio requested (height)'
        );
    }

    if (height === 0) {
        throw new ImageError(
            `The height value of the ratio \`${stringRatio}\` should not be zero`,
            400,
            'Bad ratio requested (height)'
        );
    }

    return width / height;
}