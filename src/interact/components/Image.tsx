import React from "react";

import interactConfig from "interact:conf"


import type {ImageCompressionType} from "../images/imageCompressionType.js";
import type {ImageFitType, ImageType} from "../config/jsonConfigSchema.js";
import clsx from "clsx";
import {getHtmlImageAttributes, type HtmlImageAttributes} from "../images/imageClientLibrary.js";
import {ImageError, ImageErrors} from "../images/imageErrorsDictionary.js";

import {brokenImage, urlKeyErrorProperty} from "../images/imageSharedCode.js";


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

function BrokenImage({error, altMessage}: { error: ImageError, altMessage?: string }) {
    return createImageElement({
        htmlImageAttributes: {
            width: 400,
            height: 300,
            src: `${interactConfig.images.serviceEndpoint}/${brokenImage}?${urlKeyErrorProperty}=${error.code}`
        },
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
                                        className,
                                        ratio,
                                        height,
                                        width,
                                        src,
                                        ...imgAttributesProps
                                    }: ImageProps) {
    let htmlImageAttributes: HtmlImageAttributes;
    const finalImageType: ImageType = type ?? interactConfig.images.defaultValues.type;
    const finalCompression = compression ?? interactConfig.images.defaultValues.compression;
    const finalFit = fit ?? interactConfig.images.defaultValues.fit;
    if (imgAttributesProps.alt === undefined || imgAttributesProps.alt === null) {
        return BrokenImage({error: new ImageError(ImageErrors.ALT_MISSING)})
    }

    if (src == null) {
        return BrokenImage({error: new ImageError(ImageErrors.SRC_MISSING)})
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
        return BrokenImage({error: (error as ImageError)});
    }

    return createImageElement({htmlImageAttributes, type: finalImageType, ...imgAttributesProps});

}