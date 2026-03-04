
/**
 * Convert 16:9, ... to a float
 * @param stringRatio - The ratio string to convert (e.g. "16:9")
 * @returns The ratio as a float
 * @throws Error if the ratio string is invalid
 */
function convertTextualRatioToNumber(stringRatio: string): number {
    const [widthStr, heightStr] = stringRatio.split(":", 2);

    const width = parseInt(widthStr, 10);
    if (isNaN(width)) {
        throw new Error(
            `The width value (${widthStr}) of the ratio \`${stringRatio}\` is not numeric`
        );
    }

    const height = parseInt(heightStr, 10);
    if (isNaN(height)) {
        throw new Error(
            `The height value (${heightStr}) of the ratio \`${stringRatio}\` is not numeric`
        );
    }

    if (height === 0) {
        throw new Error(
            `The height value of the ratio \`${stringRatio}\` should not be zero`
        );
    }

    return width / height;
}

