import {ImageDimensionHelper} from "./image-dimension-helper";
import sharp from "sharp";
import path from "node:path";
import type {ImageResponsiveness} from "../config/jsonConfigSchema";
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
    width: number,
    height: number,
}

type ImageRequestProps = {
    src: string,
    responsiveBehaviour?: ImageResponsiveness,
    compressionLevel?: ImageCompressionType,
    ratio?: string,
    height?: number | string,
    width?: number | string,
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

    let [targetWidth, targetHeight] = new ImageDimensionHelper({
        requestedWidth: castWidthToNumber(props.width),
        requestedHeight: castHeightToNumber(props.height),
        requestedRatio: castRatioToNumber(props.ratio),
        intrinsicWidth,
        intrinsicHeight
    }).getTargetDimensions()

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
    if (props.compressionLevel != null) {
        params.set(urlKeyCompressionProperty, props.compressionLevel)
    }

    let uri = `${interactConfig.images.serviceEndpoint}/${props.src}`;
    if (params.size > 0) {
        uri = `${uri}?${params.toString()}`;
    }
    /**
     * Srcset and sizes for responsive image
     * Width is mandatory for responsive image
     * Ref https://developers.google.com/search/docs/advanced/guidelines/google-images#responsive-images
     */
    return {
        src: uri,
        srcSet: undefined,
        width: targetWidth,
        height: targetHeight
    }
}