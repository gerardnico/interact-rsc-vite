import {ImageDimensionHelper} from "./image-dimension-helper";
import sharp from "sharp";
import path from "node:path";
import type {ImageType} from "../config/jsonConfigSchema";
import type {ImageCompressionType} from "./image-compression-type";
import interactConfig from "interact:conf"
import {
    castHeightToNumber,
    castRatioToNumber,
    castWidthToNumber, urlKeyCompressionProperty, urlKeyHeightProperty, urlKeyRatioProperty, urlKeyWidthProperty,
} from "./image-shared";
import {ImageError, ImageErrors} from "./image-errors-dictionary";


export type HtmlImageAttributes = {
    src: string,
    srcSet?: string[] | null,
    sizes?: string[] | null
    width: number,
    height: number,
}

type ImageRequestProps = {
    src: string,
    type?: ImageType,
    compression?: ImageCompressionType,
    ratio?: string,
    height?: number | string,
    width?: number | string,
}

/**
 * Return if the DPI correction is enabled or not for responsive image
 *
 * Mobile have a higher DPI and can then fit a bigger image on a smaller size.
 *
 * This can be disturbing when debugging responsive sizing image
 * If you want also to use less bandwidth, this is also useful.
 *
 * @return bool
 */
const withDpiCorrection = interactConfig.images.defaultValues?.dpiCorrection || false

function getSizes(screenWidth: number, imageWidth: number) {
    let sizes;
    if (withDpiCorrection) {
        let dpiBase = 96;
        sizes = `(max-width: ${screenWidth}px) and (min-resolution:` + (3 * dpiBase) + "dpi) " + ImageDimensionHelper.round(imageWidth / 3) + "px";
        sizes += `, (max-width: ${screenWidth}px) and (min-resolution:` + (2 * dpiBase) + "dpi) " + ImageDimensionHelper.round(imageWidth / 2) + "px";
        sizes += `, (max-width: ${screenWidth}px) and (min-resolution:${dpiBase}dpi) ${imageWidth}px`;
    } else {
        sizes = `(max-width: ${screenWidth}px) ${imageWidth}px`;
    }
    return sizes;
}

/**
 *
 * @param props
 * @throws ImageError if any error
 */
export async function getHtmlImageAttributes(props: ImageRequestProps): Promise<HtmlImageAttributes> {

    const sourceFile = path.resolve(interactConfig.images.imagesDirectory, props.src);
    let intrinsicWidth, intrinsicHeight;
    try {
        let sharpPipeline = sharp(sourceFile);
        const metadata = await sharpPipeline.metadata();
        intrinsicHeight = metadata.height;
        intrinsicWidth = metadata.width;
    } catch (err) {
        throw new ImageError({message: `Error while reading the file ${props.src}: ${String(err)}`, ...ImageErrors.NOT_FOUND})
    }

    let originalRequestDimensionHelper = new ImageDimensionHelper({
        requestedWidth: castWidthToNumber(props.width),
        requestedHeight: castHeightToNumber(props.height),
        requestedRatio: castRatioToNumber(props.ratio),
        intrinsicWidth,
        intrinsicHeight
    });
    let [targetWidth, targetHeight] = originalRequestDimensionHelper.getTargetDimensions()

    const params = new URLSearchParams();
    if (props.width != null) {
        params.set(urlKeyWidthProperty, String(props.width))
    }
    if (props.height != null) {
        params.set(urlKeyHeightProperty, String(props.height))
    }
    if (props.ratio != null) {
        params.set(urlKeyRatioProperty, props.ratio)
    }
    if (props.compression != null) {
        params.set(urlKeyCompressionProperty, props.compression)
    }

    let uriBase = `${interactConfig.images.serviceEndpoint}/${props.src}`;
    let uri = uriBase;
    if (params.size > 0) {
        uri = `${uri}?${params.toString()}`;
    }

    const imageMargin = 20;
    let srcSet: string[] = [];
    let sizes: string[] = [];

    const isHeightRequest = originalRequestDimensionHelper.isHeightRequest()
    const isAspectRatioRequest = originalRequestDimensionHelper.isRatioRequested()
    /**
     * Srcset and sizes for responsive image
     * Width is mandatory for responsive image
     * Ref https://developers.google.com/search/docs/advanced/guidelines/google-images#responsive-images
     */
    for (const breakpoint of interactConfig.images.defaultValues.responsiveBreakpoints) {

        /**
         * The image cannot scale up
         */
        if (breakpoint > targetWidth) {
            continue;
        }
        if (breakpoint > intrinsicWidth) {
            continue;
        }
        /**
         * Breakpoint Width
         */
        let breakpointWidthWithoutMargin = breakpoint - imageMargin;
        const breakPointParams = new URLSearchParams();
        if (
            !isHeightRequest // breakpoint url needs only the height attribute in this case
            || isAspectRatioRequest
        ) {
            breakPointParams.set(urlKeyWidthProperty, String(breakpointWidthWithoutMargin))
        }

        /**
         * Breakpoint Height
         */
        let breakpointHeight;
        if (
            isHeightRequest // if this is a height request
            || isAspectRatioRequest
        ) {
            breakpointHeight = ImageDimensionHelper.round((breakpointWidthWithoutMargin) / originalRequestDimensionHelper.getTargetRatio())
            breakPointParams.set(urlKeyHeightProperty, String(breakpointHeight))
        }
        if (props.compression != null) {
            breakPointParams.set(urlKeyCompressionProperty, props.compression)
        }

        srcSet.push(`${uriBase}?${breakPointParams.toString()} ${breakpointWidthWithoutMargin}w`);
        sizes.push(getSizes(breakpoint, breakpointWidthWithoutMargin));


    }
    return {
        src: uri,
        srcSet: srcSet.length == 0 ? null : srcSet,
        sizes: sizes.length == 0 ? null : sizes,
        width: targetWidth,
        height: targetHeight
    }
}