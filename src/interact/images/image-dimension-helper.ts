/**
 * Minimal exception types — replace with your own implementations as needed.
 */
export class ExceptionNotFound extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExceptionNotFound';
    }
}

/**
 * Helper to calculate the target width and height with support for ratio
 * so that we don't have any cls error
 *
 *
 * Note: HTML element width and height have an effect on the space reservation
 * but not on responsive image at all
 */
export class ImageDimensionHelper {


    private readonly requestedWidth: number | null;
    private readonly requestedHeight: number | null;
    private readonly intrinsicWidth: number;
    private readonly intrinsicHeight: number;
    private readonly requestedRatio: number | null;

    /**
     * Build Image from an URL
     */
    constructor({requestedWidth, requestedHeight, requestedRatio, intrinsicWidth, intrinsicHeight}: {
        requestedWidth: number | null | undefined,
        requestedHeight: number | null | undefined,
        requestedRatio: number | null | undefined,
        intrinsicWidth: number, // For a raster image, the internal width; for SVG, the defined viewBox width.
        intrinsicHeight: number // For a raster image, the internal height; for SVG, the defined viewBox height.
    }) {


        if (requestedWidth == null || requestedWidth <= 0) {
            this.requestedWidth = null;
        } else {
            this.requestedWidth = requestedWidth;
        }
        if (requestedHeight == null || requestedHeight <= 0) {
            this.requestedHeight = null;
        } else {
            this.requestedHeight = requestedHeight;
        }
        this.intrinsicWidth = intrinsicWidth;
        this.intrinsicHeight = intrinsicHeight;
        if (requestedRatio == null || requestedRatio <= 0) {
            this.requestedRatio = null;
        } else {
            this.requestedRatio = requestedRatio;
        }

        return this;
    }


    /**
     * Intrinsic aspect ratio (width / height).
     */
    #getIntrinsicAspectRatio(): number {
        return this.intrinsicWidth / this.intrinsicHeight;
    }

    /**
     * Aspect ratio of the target (potentially scaled/cropped) image.
     */
    #getTargetAspectRatio(): number {
        return this.#getTargetWidth() / this.#getTargetHeight();
    }

    /**
     * Returns the requested aspect ratio as a float.
     * Falls back to requestedWidth / requestedHeight if no explicit ratio was set.
     */
    #getCalculatedRequestedAspectRatioAsFloat(): number | null {
        if (this.requestedRatio != null) {
            return this.requestedRatio;
        }
        if (this.requestedHeight == null) {
            return null;
        }
        if (this.requestedWidth == null) {
            return null;
        }
        return this.requestedWidth / this.requestedHeight;
    }

    /**
     * Verify that a width/height pair matches the target aspect ratio (±1 px tolerance).
     * Logs an internal error on mismatch.
     */
    #checkLogicalRatioAgainstTargetRatio(width: number, height: number): void {
        let targetRatio: number;
        try {
            targetRatio = this.#getTargetAspectRatio();
        } catch (e) {
            console.warn(`Unable to check the target ratio because it returns this error: ${(e as Error).message}`);
            return;
        }

        const withinBound = (a: number, b: number): boolean => a >= b - 1 && a <= b + 1;

        if (!withinBound(height * targetRatio, width) && !withinBound(width / targetRatio, height)) {
            const imgTagRatio = width / height;
            console.warn(
                `Internal Error: The width (${width}) and height (${height}) calculated for the image ` +
                `(${this}) does not pass the ratio test. They have a ratio of (${imgTagRatio}) ` +
                `while the target dimension ratio is (${targetRatio})`
            );
        }
    }

    /**
     * The logical (target) height derived from requested dimensions.
     * Resolution order: explicit height → scale by width → scale by ratio → intrinsic height.
     */
    #getTargetHeight(): number {
        if (this.requestedHeight != null) {
            return this.requestedHeight;
        }

        if (this.requestedWidth != null) {
            let ratio = this.#getCalculatedRequestedAspectRatioAsFloat();
            if (ratio == null) {
                ratio = this.#getIntrinsicAspectRatio();
            }
            if (ratio != null) {
                return ImageDimensionHelper.round(this.requestedWidth / ratio);
            }
        }


        const ratio = this.#getCalculatedRequestedAspectRatioAsFloat();
        if (ratio != null) {
            const [, croppedHeight] = this.#getCroppingDimensionsWithRatio(ratio);
            return croppedHeight;
        }

        return this.intrinsicHeight;
    }

    /**
     * The logical (target) width derived from requested dimensions.
     * Resolution order: explicit width → scale by height → scale by ratio → intrinsic width.
     */
    #getTargetWidth(): number {
        if (this.requestedWidth != null) {
            return this.requestedWidth;
        }

        if (this.requestedHeight != null) {
            let ratio = this.#getCalculatedRequestedAspectRatioAsFloat();
            if (ratio == null) {
                ratio = this.#getIntrinsicAspectRatio();
            }
            if (ratio != null) {
                return ImageDimensionHelper.round(ratio * this.requestedHeight);
            }
        }


        const ratio = this.#getCalculatedRequestedAspectRatioAsFloat();
        if (ratio != null) {
            const [logicalWidth] = this.#getCroppingDimensionsWithRatio(ratio);
            return logicalWidth;
        }

        return this.intrinsicWidth;
    }


    /**
     * Round a float to the nearest integer.
     * The fetch endpoint uses integers for width/height, and the security token
     * is derived from them, so rounding must be consistent (not truncated).
     */
    static round(value: number): number {
        return Math.round(value);
    }

    /**
     * Return [width, height] after applying a crop ratio (e.g. 16/9, 4/3).
     * Crops to fit within intrinsic dimensions.
     */
    #getCroppingDimensionsWithRatio(targetRatio: number): [number, number] {
        let logicalWidth = this.intrinsicWidth;
        let logicalHeight = ImageDimensionHelper.round(logicalWidth / targetRatio);

        if (logicalHeight > this.intrinsicHeight) {
            logicalHeight = this.intrinsicHeight;
            logicalWidth = ImageDimensionHelper.round(targetRatio * logicalHeight);
        }

        return [logicalWidth, logicalHeight];
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns true when both width + height are set, or a ratio is set.
     * Will be used when we have the cropFocus (middle, left top, ...)
     */
    isCropRequested(): boolean {
        if (this.requestedHeight !== null && this.requestedWidth !== null) return true;
        return this.requestedRatio !== null;
    }

    /**
     * Return the target dimension (ie the logical dimension on the img/picture element)
     */
    getTargetDimensions() {
        const targetHeight = this.#getTargetHeight()
        const targetWidth = this.#getTargetWidth();
        this.#checkLogicalRatioAgainstTargetRatio(targetWidth, targetHeight);
        return [targetWidth, targetHeight];
    }

    isRatioRequested() {

        return this.#getCalculatedRequestedAspectRatioAsFloat() != null

    }

    isHeightRequest() {
        return this.requestedWidth == null && this.requestedHeight != null;
    }

    /**
     * The Aspect ratio of the target image (maybe the original or an image scaled down)
     *
     * https://html.spec.whatwg.org/multipage/embedded-content-other.html#attr-dim-height
     * @return float
     * false if the image is not supported
     *
     * It's needed for an img tag to set the img `width` and `height` that pass the
     * {@link #checkWidthAndHeightRatioAndReturnTheGoodValue() check}
     * to avoid layout shift
     *
     */
    getTargetRatio() {
        return this.#getTargetWidth() / this.#getTargetHeight();
    }
}
