import {z} from "zod";
import {signUrl, verifyUrlAndDeleteVerificationProperties} from "./UrlSignature";
import {type ImageQualityPreset, ImageQualityPresetSchema} from "./image-quality-preset";
import type {FormatEnum} from "sharp";
import crypto from "crypto";
import path from "path";
import * as mime from "mrmime";

/**
 * Minimal exception types — replace with your own implementations as needed.
 */
export class ExceptionNotFound extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExceptionNotFound';
    }
}

export class ExceptionBadSyntax extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExceptionBadSyntax';
    }
}

export class ExceptionCast extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExceptionCast';
    }
}


export interface TagAttributes {
    width?: string | number;
    w?: string | number;
    height?: string | number;
    h?: string | number;
    ratio?: string;

    [key: string]: unknown;
}


declare const DataType: {
    toInteger(value: number): number;
};
declare const ConditionalLength: {
    createFromString(value: string): { toPixelNumber(): number };
};


function hash(input: crypto.BinaryLike) {
    return crypto.createHash("sha1").update(input).digest("hex");
}

function getFormatFromAcceptHeader(req: Request, sourceFile: string): keyof FormatEnum {

    const accept = req.headers.get('accept') || "";

    // Example of Accept header for chrome
    // image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8
    // avif first, webp is supported
    if (accept.includes("image/avif")) return "avif";
    if (accept.includes("image/webp")) return "webp";

    const original = path.extname(sourceFile).replace(".", "");
    return original as keyof FormatEnum;
}

/**
 * Image request / response
 *
 * Holds requested transform attributes (width, height, aspect ratio) for an image,
 * and calculates target dimensions accordingly.
 *
 * Image may be generated — that's why this does not extend FetcherRawLocalPath.
 * Image that depends on a source file should implement IFetcherLocalImage.
 *
 * See also third-party providers such as:
 *   https://docs.imgix.com/setup/quick-start
 */
export class ImageObject {
    private signingSecret: string;

    getContentType() {
        return mime.lookup(this.requestedFormat as string);
    }


    static readonly TOK = 'tok';
    static readonly CANONICAL = 'image';

    protected requestedWidth: number | null = null;
    protected requestedHeight: number | null = null;

    private _requestedRatio: string | null = null;
    private _requestedRatioAsFloat: number | null = null;
    private imgPath: string;
    private qualityPreset: ImageQualityPreset;
    private cacheKey: string;
    private requestedFormat: keyof FormatEnum;

    /**
     * Build and return a URL with fetch parameters appended.
     */
    getFetchUrl(url: URL): URL {
        try {
            const ratio = this.getRequestedAspectRatio();
            if (!url.searchParams.has('ratio')) url.searchParams.set('ratio', ratio);
        } catch (e) {
            if (!(e instanceof ExceptionNotFound)) throw e;
        }

        try {
            const w = this.getRequestedWidth();
            if (!url.searchParams.has('w')) url.searchParams.set('w', String(w));
        } catch (e) {
            if (!(e instanceof ExceptionNotFound)) throw e;
        }

        try {
            const h = this.getRequestedHeight();
            if (!url.searchParams.has('h')) url.searchParams.set('h', String(h));
        } catch (e) {
            if (!(e instanceof ExceptionNotFound)) throw e;
        }

        if (this.qualityPreset) url.searchParams.set('quality', this.qualityPreset)

        signUrl(url, this.signingSecret)

        return url;
    }

    getImgPath() {
        return this.imgPath;
    }


    /**
     * Build Image from an URL
     */
    constructor(req: Request, endPoint: string, secret: string) {

        this.signingSecret = secret;
        const url = new URL(req.url, "http://localhost");

        verifyUrlAndDeleteVerificationProperties(url, this.signingSecret)

        if (!url.pathname) {
            throw new Error(`Missing path`);
        }
        if (!url.pathname.startsWith(endPoint)) {
            throw new Error(`Path does not start with end point ${endPoint}`);
        }
        this.imgPath = url.pathname.substring(endPoint.length + 1); // +1 to delete the root separator

        /**
         * Url does not have the signing and expiration
         */
        this.cacheKey = hash(this.imgPath + url.searchParams.toString());

        const requestedFormat = url.searchParams.get("f") as keyof FormatEnum | null;

        this.requestedFormat = requestedFormat || getFormatFromAcceptHeader(req, this.imgPath);

        const rawWidth = url.searchParams.get("width") || url.searchParams.get("w");
        if (rawWidth !== null) {
            const widthSchema = z.coerce.number().int().positive().describe("A image width should have a positive integer value");
            try {
                this.setRequestedWidth(widthSchema.parse(rawWidth));
            } catch (e) {
                throw new Error(`bad width value ${rawWidth}`, {cause: e});
            }
        }

        const rawHeight = url.searchParams.get("height") || url.searchParams.get("h");
        if (rawHeight) {
            const heightSchema = z.coerce.number().int().positive().describe("A image height should have a positive integer value");
            try {
                this.setRequestedHeight(heightSchema.parse(rawHeight));
            } catch (e) {
                throw new Error(`bad height value ${rawHeight}`, {cause: e});
            }
        }

        const rawRatio = url.searchParams.get('ratio') || url.searchParams.get('r');
        if (rawRatio !== null) {
            try {
                this.setRequestedAspectRatio(String(rawRatio));
            } catch (e) {
                throw new Error(`bad ratio value ${rawRatio}`, {cause: e});
            }
        }


        let qualityRawValue = (url.searchParams.get("quality") || url.searchParams.get('q')) || 'high';
        try {
            this.qualityPreset = ImageQualityPresetSchema.parse(qualityRawValue);
        } catch (e) {
            throw new Error(`bad quality value ${qualityRawValue}`, {cause: e});
        }

        return this;
    }

    /**
     * For a raster image, the internal width; for SVG, the defined viewBox width.
     * @returns pixels
     */
    getIntrinsicWidth(): number {
        // todo
        return 0
    }


    /**
     * For a raster image, the internal height; for SVG, the defined viewBox height.
     * @returns pixels
     */
    getIntrinsicHeight(): number {
        // todo
        return 0
    }

    /**
     * Intrinsic aspect ratio (width / height).
     */
    getIntrinsicAspectRatio(): number {
        return this.getIntrinsicWidth() / this.getIntrinsicHeight();
    }

    /**
     * Aspect ratio of the target (potentially scaled/cropped) image.
     */
    getTargetAspectRatio(): number {
        return this.getTargetWidth() / this.getTargetHeight();
    }

    /**
     * Returns the requested aspect ratio as a float.
     * Falls back to requestedWidth / requestedHeight if no explicit ratio was set.
     * @throws {ExceptionNotFound}
     */
    getCalculatedRequestedAspectRatioAsFloat(): number {
        if (this._requestedRatioAsFloat !== null) {
            return this._requestedRatioAsFloat;
        }
        // Both getters throw ExceptionNotFound on null/0 — no division-by-zero risk
        return this.getRequestedWidth() / this.getRequestedHeight();
    }

    /**
     * Verify that a width/height pair matches the target aspect ratio (±1 px tolerance).
     * Logs an internal error on mismatch.
     */
    checkLogicalRatioAgainstTargetRatio(width: number, height: number): void {
        let targetRatio: number;
        try {
            targetRatio = this.getTargetAspectRatio();
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
    getTargetHeight(): number {
        try {
            return this.getRequestedHeight();
        } catch { /* no explicit height */
        }

        try {
            const width = this.getRequestedWidth();
            let ratio: number;
            try {
                ratio = this.getCalculatedRequestedAspectRatioAsFloat();
            } catch {
                ratio = this.getIntrinsicAspectRatio();
            }
            return ImageObject.round(width / ratio);
        } catch { /* no requested width */
        }

        try {
            const ratio = this.getCalculatedRequestedAspectRatioAsFloat();
            const [, croppedHeight] = this.getCroppingDimensionsWithRatio(ratio);
            return croppedHeight;
        } catch { /* no requested ratio */
        }

        return this.getIntrinsicHeight();
    }

    /**
     * The logical (target) width derived from requested dimensions.
     * Resolution order: explicit width → scale by height → scale by ratio → intrinsic width.
     */
    getTargetWidth(): number {
        try {
            return this.getRequestedWidth();
        } catch { /* no explicit width */
        }

        try {
            const height = this.getRequestedHeight();
            let ratio: number;
            try {
                ratio = this.getCalculatedRequestedAspectRatioAsFloat();
            } catch {
                ratio = this.getIntrinsicAspectRatio();
            }
            return ImageObject.round(ratio * height);
        } catch { /* no requested height */
        }

        try {
            const ratio = this.getCalculatedRequestedAspectRatioAsFloat();
            const [logicalWidth] = this.getCroppingDimensionsWithRatio(ratio);
            return logicalWidth;
        } catch { /* no requested ratio */
        }

        return this.getIntrinsicWidth();
    }

    /**
     * @throws {ExceptionNotFound} if no width was requested, or width is 0
     */
    getRequestedWidth(): number {
        if (this.requestedWidth === null) throw new ExceptionNotFound('No width was requested');
        if (this.requestedWidth === 0) throw new ExceptionNotFound('Width 0 was requested');
        return this.requestedWidth;
    }

    /**
     * @throws {ExceptionNotFound} if no height was requested, or height is 0
     */
    getRequestedHeight(): number {
        if (this.requestedHeight === null) throw new ExceptionNotFound('Height not requested');
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
    getCroppingDimensionsWithRatio(targetRatio: number): [number, number] {
        let logicalWidth = this.getIntrinsicWidth();
        let logicalHeight = ImageObject.round(logicalWidth / targetRatio);

        if (logicalHeight > this.getIntrinsicHeight()) {
            logicalHeight = this.getIntrinsicHeight();
            logicalWidth = ImageObject.round(targetRatio * logicalHeight);
        }

        return [logicalWidth, logicalHeight];
    }

    setRequestedWidth(requestedWidth: number): this {
        this.requestedWidth = requestedWidth;
        return this;
    }

    setRequestedHeight(requestedHeight: number): this {
        this.requestedHeight = requestedHeight;
        return this;
    }

    /**
     * @param requestedRatio  e.g. "16x9"
     * @throws {ExceptionBadSyntax}
     */
    setRequestedAspectRatio(requestedRatio: string): this {
        this._requestedRatio = requestedRatio;
        this._requestedRatioAsFloat = convertTextualRatioToNumber(requestedRatio);
        return this;
    }

    toString(): string {
        return this.constructor.name;
    }

    hasHeightRequested(): boolean {
        try {
            this.getRequestedHeight();
            return true;
        } catch {
            return false;
        }
    }

    hasAspectRatioRequested(): boolean {
        try {
            this.getCalculatedRequestedAspectRatioAsFloat();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * @throws {ExceptionNotFound}
     * @returns the ratio string, e.g. "16x9"
     */
    getRequestedAspectRatio(): string {
        if (this._requestedRatio === null) throw new ExceptionNotFound('No ratio was specified');
        return this._requestedRatio;
    }

    /**
     * Returns true when both width + height are set, or a ratio is set.
     */
    isCropRequested(): boolean {
        if (this.requestedHeight !== null && this.requestedWidth !== null) return true;
        return this._requestedRatio !== null;
    }

    getRequestedFormat() {
        return this.requestedFormat
    }

    getCacheKey() {
        return this.cacheKey
    }

    getQualityPreset() {
        return this.qualityPreset;
    }
}
