import React from "react";


import type {ImageCompressionType} from "../../interact/images/imageCompressionType";
import type {ImageFitType, ImageType} from "../../interact/config/configSchema";
import clsx from "clsx";
import {getHtmlImageAttributes, type HtmlImageAttributes} from "../../interact/images/imageClientLibrary";
import {ImageError, ImageErrors} from "../../interact/images/imageErrorsDictionary";

import {brokenImage} from "../../interact/images/imageSharedCode";
import {getInteractConfig} from "@combostrap/interact/config";


export type ImageProps =
    React.ImgHTMLAttributes<HTMLImageElement>
    & {
    ratio?: string;
    compression?: ImageCompressionType;
    type?: ImageType;
    fit?: ImageFitType;
}

function createImageElement(
    {
        htmlImageAttributes,
        type,
        style,
        className,
        ...imgAttributesProps
    }: AllImageProps) {
    const finalStyle = {
        /**
         * We don't allow the image to scale up by default
         */
        maxHeight: htmlImageAttributes.height,
        /**
         * if the image has a class that has a `height: 100%`, the image will stretch
         */
        height: "auto",
        /**
         * We don't allow the image to scale up by default
         */
        maxWidth: htmlImageAttributes.width,
        /**
         * We allow the image to scale up to 100% of its parent
         */
        width: "100%",
        ...style
    }

    /**
     * Note: HTML element width and height attributes have an effect on the space reservation
     * but not on responsive image at all (They reserve space)
     */
    return (

        <img
            src={htmlImageAttributes.src}
            {...(htmlImageAttributes.srcSet != null && {srcSet: htmlImageAttributes.srcSet.join(', ')})}
            {...(htmlImageAttributes.sizes != null && {sizes: htmlImageAttributes.sizes.join(', ')})}
            alt={imgAttributesProps.alt}
            width={htmlImageAttributes.width}
            height={htmlImageAttributes.height}
            className={clsx(
                className,
                type == 'fluid' && 'img-fluid'
            )}
            {...imgAttributesProps}
            style={finalStyle}
        />

    )
}

async function BrokenImage({src, error, altMessage}: { src: string, error: ImageError, altMessage?: string }) {
    const isBuild = import.meta.env.MODE === 'production'
    if (isBuild) {
        throw new Error(`The processing of the image ${src} returned an error`, {cause: error});
    }
    let htmlImageAttributes = await getHtmlImageAttributes({
        src: brokenImage,
        height: 300,
        width: 400,
        error: error.code
    });
    return createImageElement({
        htmlImageAttributes: htmlImageAttributes,
        alt: altMessage != null ? altMessage : error.message
    })
}

type AllImageProps = {
    type?: ImageType;
    htmlImageAttributes: HtmlImageAttributes,
} & React.ImgHTMLAttributes<HTMLImageElement>;


/**
 * An Image React component
 */
export default async function Image({
                                        type,
                                        compression,
                                        fit,
                                        ratio,
                                        height,
                                        width,
                                        src,
                                        ...imgAttributesProps
                                    }: ImageProps) {
    let htmlImageAttributes: HtmlImageAttributes;
    const interactConfig = getInteractConfig();
    const finalImageType: ImageType = type ?? interactConfig.images.defaultValues.type;
    const finalCompression = compression ?? interactConfig.images.defaultValues.compression;
    const finalFit = fit ?? interactConfig.images.defaultValues.fit;

    if (src == null) {
        return BrokenImage({
            src: "unknow",
            error: new ImageError(ImageErrors.SRC_MISSING)
        })
    }

    if (imgAttributesProps.alt === undefined || imgAttributesProps.alt === null) {
        return BrokenImage({
            src: src,
            error: new ImageError(ImageErrors.ALT_MISSING)
        })
    }
    try {
        htmlImageAttributes = await getHtmlImageAttributes({
            src: src,
            type: finalImageType,
            compression: finalCompression,
            fit: finalFit,
            width: width,
            height: height,
            ratio: ratio,
        });
    } catch (error) {
        return BrokenImage({
            src: src,
            error: (error as ImageError)
        });
    }

    return createImageElement({htmlImageAttributes, type: finalImageType, ...imgAttributesProps});

}