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


    private readonly requestedWidth: number | null | undefined;
    private readonly requestedHeight: number | null | undefined;
    private readonly intrinsicWidth: number;
    private readonly intrinsicHeight: number;
    private readonly requestedRatio: number | null | undefined;

    /**
     * Build Image from an URL
     */
    constructor({requestedWidth, requestedHeight, requestedRatio, intrinsicWidth, intrinsicHeight}: {
        requestedWidth: number | null | undefined,
        requestedHeight: number | null | undefined,
        requestedRatio: number | null | undefined,
        intrinsicWidth: number,
        intrinsicHeight: number
    }) {

        this.requestedWidth = requestedWidth;
        if (requestedWidth == 0) this.requestedWidth = null;
        this.requestedHeight = requestedHeight;
        if (requestedHeight == 0) this.requestedHeight = null;
        this.intrinsicWidth = intrinsicWidth;
        this.intrinsicHeight = intrinsicHeight;
        this.requestedRatio = requestedRatio;

        return this;
    }

    /**
     * For a raster image, the internal width; for SVG, the defined viewBox width.
     * @returns pixels
     */
    #getIntrinsicWidth(): number {
        return this.intrinsicWidth
    }


    /**
     * For a raster image, the internal height; for SVG, the defined viewBox height.
     * @returns pixels
     */
    #getIntrinsicHeight(): number {
        return this.intrinsicHeight
    }

    /**
     * Intrinsic aspect ratio (width / height).
     */
    #getIntrinsicAspectRatio(): number {
        return this.#getIntrinsicWidth() / this.#getIntrinsicHeight();
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
     * @throws {ExceptionNotFound}
     */
    #getCalculatedRequestedAspectRatioAsFloat(): number {
        if (this.requestedRatio != null) {
            return this.requestedRatio;
        }
        // Both getters throw ExceptionNotFound on null/0 — no division-by-zero risk
        return this.#getRequestedWidth() / this.#getRequestedHeight();
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
        try {
            return this.#getRequestedHeight();
        } catch { /* no explicit height */
        }

        try {
            const width = this.#getRequestedWidth();
            let ratio: number;
            try {
                ratio = this.#getCalculatedRequestedAspectRatioAsFloat();
            } catch {
                ratio = this.#getIntrinsicAspectRatio();
            }
            return ImageDimensionHelper.round(width / ratio);
        } catch { /* no requested width */
        }

        try {
            const ratio = this.#getCalculatedRequestedAspectRatioAsFloat();
            const [, croppedHeight] = this.#getCroppingDimensionsWithRatio(ratio);
            return croppedHeight;
        } catch { /* no requested ratio */
        }

        return this.#getIntrinsicHeight();
    }

    /**
     * The logical (target) width derived from requested dimensions.
     * Resolution order: explicit width → scale by height → scale by ratio → intrinsic width.
     */
    #getTargetWidth(): number {
        try {
            return this.#getRequestedWidth();
        } catch { /* no explicit width */
        }

        try {
            const height = this.#getRequestedHeight();
            let ratio: number;
            try {
                ratio = this.#getCalculatedRequestedAspectRatioAsFloat();
            } catch {
                ratio = this.#getIntrinsicAspectRatio();
            }
            return ImageDimensionHelper.round(ratio * height);
        } catch { /* no requested height */
        }

        try {
            const ratio = this.#getCalculatedRequestedAspectRatioAsFloat();
            const [logicalWidth] = this.#getCroppingDimensionsWithRatio(ratio);
            return logicalWidth;
        } catch { /* no requested ratio */
        }

        return this.#getIntrinsicWidth();
    }

    /**
     * @throws {ExceptionNotFound} if no width was requested, or width is 0
     */
    #getRequestedWidth(): number {

        if (this.requestedWidth == null) throw new ExceptionNotFound('No width was requested');
        if (this.requestedWidth === 0) throw new ExceptionNotFound('Width 0 was requested');
        return this.requestedWidth;
    }

    /**
     * @throws {ExceptionNotFound} if no height was requested, or height is 0
     */
    #getRequestedHeight(): number {
        if (this.requestedHeight == null) throw new ExceptionNotFound('Height not requested');
        if (this.requestedHeight === 0) throw new ExceptionNotFound('Height 0 requested');
        return this.requestedHeight;
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
        let logicalWidth = this.#getIntrinsicWidth();
        let logicalHeight = ImageDimensionHelper.round(logicalWidth / targetRatio);

        if (logicalHeight > this.#getIntrinsicHeight()) {
            logicalHeight = this.#getIntrinsicHeight();
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
        try {
            this.#getCalculatedRequestedAspectRatioAsFloat()
            return true;
        } catch {
            return false;
        }
    }

    isHeightRequest() {
        return this.requestedWidth == null
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
       return this.#getTargetWidth()/this.#getRequestedHeight();
    }
}
