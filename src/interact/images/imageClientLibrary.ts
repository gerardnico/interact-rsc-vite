import {ImageDimensionHelper} from "./imageDimensionHelper";
import sharp, {type FitEnum} from "sharp";
import path from "node:path";
import type {ImageFitType, ImageType} from "../config/jsonConfigSchema";
import type {ImageCompressionType} from "./imageCompressionType";
import interactConfig from "interact:conf"
import {
    castHeightToNumber,
    castRatioToNumber,
    castWidthToNumber,
    type ImageServiceKeyUrl,
    processImageWithSharp
} from "./imageSharedCode";
import {ImageError, ImageErrors} from "./imageErrorsDictionary";
import fsPromises from "fs/promises";
import crypto from "crypto";

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

async function toImageServiceUri(src: string, serviceProperties: Partial<Record<ImageServiceKeyUrl, string>>, sharpPipeline: sharp.Sharp) {

    /**
     * In dev/start mode?
     */
    const isBuild = import.meta.env.MODE === 'production'
    if (!isBuild) {
        // The endpoint of the local service endpoint ("/_images")
        let serviceEndpoint = process.env.INTERACT_IMAGE_ENPOINT
        if (!serviceEndpoint) {
            throw new Error("Service endpoint env is not defined (process.env.INTERACT_IMAGE_ENPOINT)")
        }
        let uriBase = `${serviceEndpoint}/${src}`
        if (Object.keys(serviceProperties).length == 0) {
            return uriBase
        }
        const params = new URLSearchParams(serviceProperties);
        return `${uriBase}?${params.toString()}`;
    }

    /**
     * In static generation mode
     */
    const imageBuffer = await processImageWithSharp({
        sharpPipeline,
        targetWidth: Number(serviceProperties.width),
        targetHeight: Number(serviceProperties.height),
        requestedFit: serviceProperties.fit as keyof FitEnum,
        requestedFormat: 'webp',
        requestedCompression: serviceProperties.compression as ImageCompressionType
    })
    const normalizedProperties = JSON.stringify(serviceProperties, Object.keys(serviceProperties).sort());
    const hash = crypto.createHash('sha256').update(normalizedProperties).digest('hex').slice(0, 16);


    const pathWithoutExtension = src.slice(0, src.indexOf(".")); // 'path/file'
    const extension = src.slice(src.indexOf("."));  // '.txt'
    let buildUri = `/img/${pathWithoutExtension}-${hash}.${extension}`;

    /**
     * Write to file
     */
    const buildTargetFile = `${process.env.VITE_OUT_DIR}/client${buildUri}`;
    debugger
    await fsPromises.mkdir(path.dirname(buildTargetFile), {recursive: true});
    await fsPromises.writeFile(buildTargetFile, imageBuffer);

    return buildUri

}

/**
 *
 * @param props
 * @throws ImageError if any error
 */
export async function getHtmlImageAttributes(props: ImageRequestProps): Promise<HtmlImageAttributes> {

    const sourceFile = path.resolve(interactConfig.images.imagesDirectory, props.src);
    let intrinsicWidth, intrinsicHeight;
    let sharpPipeline;
    try {
        sharpPipeline = sharp(sourceFile);
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


    let uri = await toImageServiceUri(props.src, serviceProperties, sharpPipeline);

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

        srcSet.push(await toImageServiceUri(props.src, serviceProperties, sharpPipeline) + ` ${breakpointWidthWithoutMargin}w`);
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
