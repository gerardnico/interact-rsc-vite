import {ImageDimensionHelper} from "./imageDimensionHelper";
import sharp from "sharp";
import path from "node:path";
import type {ImageFitType, ImageType} from "../config/jsonConfigSchema";
import type {ImageCompressionType} from "./imageCompressionType";
import interactConfig from "interact:conf"
import {
    castHeightToNumber,
    castRatioToNumber,
    castWidthToNumber,
    type ImageServiceKeyUrl
} from "./imageSharedCode";
import {ImageError, ImageErrors} from "./imageErrorsDictionary";


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
    fit?: ImageFitType,
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

function toImageServiceUri(uriBase: string, serviceProperties: Partial<Record<ImageServiceKeyUrl, string>>) {
    if (Object.keys(serviceProperties).length == 0) {
        return uriBase
    }
    const params = new URLSearchParams(serviceProperties);
    return `${uriBase}?${params.toString()}`;
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

    let serviceProperties: Partial<Record<ImageServiceKeyUrl, string>> = {}

    if (props.width != null) {
        serviceProperties.width = String(props.width)
    }
    if (props.height != null) {
        serviceProperties.height = String(props.height)
    }
    if (props.ratio != null) {
        serviceProperties.ratio = props.ratio
    }
    if (props.compression != null && props.compression != "none") {
        serviceProperties.compression = props.compression
    }
    if (props.fit != null && originalRequestDimensionHelper.isCropRequested()) {
        serviceProperties.fit = props.fit;
    }

    let uriBase = `${interactConfig.images.serviceEndpoint}/${props.src}`;
    let uri = toImageServiceUri(uriBase, serviceProperties);

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
        delete serviceProperties.width
        delete serviceProperties.height
        /**
         * Breakpoint Width
         */
        let breakpointWidthWithoutMargin = breakpoint - imageMargin;
        if (
            !isHeightRequest // breakpoint url needs only the height attribute in this case
            || isAspectRatioRequest
        ) {
            serviceProperties.width = String(breakpointWidthWithoutMargin)
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
            serviceProperties.height = String(breakpointHeight)
        }

        srcSet.push(toImageServiceUri(uriBase, serviceProperties) + ` ${breakpointWidthWithoutMargin}w`);
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