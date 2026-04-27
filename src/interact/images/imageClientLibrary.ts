import {ImageDimensionHelper} from "./imageDimensionHelper.js";
import sharp, {type FitEnum} from "sharp";
import path from "node:path";
import type {ImageFitType, ImageType} from "../config/configSchema.js";
import type {ImageCompressionType} from "./imageCompressionType.js";
import {
    castHeightToNumber,
    castRatioToNumber,
    castWidthToNumber,
    type ImageServiceKeyUrl,
    processImageWithSharp
} from "./imageSharedCode.js";
import {ImageError, ImageErrors} from "./imageErrorsDictionary.js";
import fsPromises from "fs/promises";
import crypto from "crypto";
import {getInteractConfig} from "../config/interactConfig.js";
import {imageEndPointEnvName, imageViteOutDirEnvName} from "./imageMiddlewareHandler.js";
import fs from "fs";


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
    error?: number
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
const interactConfig = getInteractConfig()
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
 * @param src - the src path
 * @param serviceProperties - the image service properties
 * @param sharpPipeline - a sharp instance - may be undefined when we send an error request (ie the file is on the server, not the client)
 */
async function toImageServiceUri(src: string, serviceProperties: Partial<Record<ImageServiceKeyUrl, string>>, sharpPipeline?: sharp.Sharp) {

    /**
     * In dev/start mode?
     */
    const isBuild = import.meta.env.MODE === 'production'
    if (!isBuild) {
        // The endpoint of the local service endpoint ("/_images")
        let serviceEndpoint = process.env[imageEndPointEnvName]
        if (!serviceEndpoint) {
            throw new Error(`Service endpoint env (${imageEndPointEnvName}) is not defined`)
        }
        let uriBase = `${serviceEndpoint}/${src}`
        if (Object.keys(serviceProperties).length == 0) {
            return uriBase
        }
        const params = new URLSearchParams(serviceProperties);
        return `${uriBase}?${params.toString()}`;
    }

    if (sharpPipeline == null) {
        throw new Error(`Internal: sharp is mandatory to generate the image ${src}`)
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
    const extension = src.slice(src.indexOf(".") + 1);  // 'txt'
    let buildUri = `/img/${pathWithoutExtension}-${hash}.${extension}`;

    let viteOutDir = process.env[imageViteOutDirEnvName];
    if (!viteOutDir) {
        throw new Error(`The env ${imageViteOutDirEnvName} is not defined`);
    }
    /**
     * Write to file
     */
    const buildTargetFile = `${viteOutDir}/client${buildUri}`;
    await fsPromises.mkdir(path.dirname(buildTargetFile), {recursive: true});
    await fsPromises.writeFile(buildTargetFile, imageBuffer);

    /**
     * base
     */
    let base = interactConfig.site.base;
    if (base!="/"){
        return `${base}${buildUri}`;
    }
    return buildUri

}

/**
 *
 * @param props
 * @throws ImageError if any error
 */
export async function getHtmlImageAttributes(props: ImageRequestProps): Promise<HtmlImageAttributes> {

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

    if (props.error) {
        /**
         * Error request
         */
        serviceProperties.error = String(props.error);
        let uri = await toImageServiceUri(props.src, serviceProperties);
        return {
            src: uri,
            width: Number(props.width) || 100,
            height: Number(props.height) || 100,
        }
    }

    const sourceFile = path.resolve(interactConfig.paths.imagesDirectory, props.src);
    if (!fs.existsSync(sourceFile)) {
        throw new ImageError({
            ...ImageErrors.NOT_FOUND,
            message: `The image file ${props.src} was not found at ${sourceFile}`,
        })
    }
    let intrinsicWidth, intrinsicHeight;
    let sharpPipeline;
    try {
        sharpPipeline = sharp(sourceFile);
        const metadata = await sharpPipeline.metadata();
        intrinsicHeight = metadata.height;
        intrinsicWidth = metadata.width;
    } catch (err) {
        throw new ImageError({
            ...ImageErrors.SHARP_ERROR,
            message: `Sharp error while reading the image file ${props.src} (${sourceFile})`,
            options: {
                cause: err
            }
        })
    }

    let originalRequestDimensionHelper = new ImageDimensionHelper({
        requestedWidth: castWidthToNumber(props.width),
        requestedHeight: castHeightToNumber(props.height),
        requestedRatio: castRatioToNumber(props.ratio),
        intrinsicWidth,
        intrinsicHeight
    });
    let {targetWidth, targetHeight} = originalRequestDimensionHelper.getTargetDimensions()

    const isSsg = import.meta.env.MODE === 'production'
    if (isSsg) {
        // in ssg, the dimension are mandatory
        // ie we may have width or height and ratio but
        // for the image generation, sharp will throw an error if width or height is missing
        serviceProperties.width = String(targetWidth);
        serviceProperties.height = String(targetHeight);
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
        if (targetWidth && breakpoint > targetWidth) {
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
