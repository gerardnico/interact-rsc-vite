import React from "react";

import interactConfig from "interact:conf"


import type {ImageCompressionType} from "../images/image-compression-type";
import type {ImageResponsiveness} from "../config/jsonConfigSchema";
import clsx from "clsx";
import {getHtmlImageAttributes, type HtmlImageAttributes} from "../images/image-client";
import {ImageError, ImageErrors} from "../images/image-errors-dictionary";

import {brokenImage, urlKeyErrorProperty} from "../images/image-shared";


export type ImageType =
    React.ImgHTMLAttributes<HTMLImageElement>
    & {
    ratio?: string;
    compressionLevel?: ImageCompressionType;
    responsiveBehaviour?: ImageResponsiveness;
}

function createImageElement(
    {
        htmlImageAttributes,
        responsiveBehaviour,
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
     * HTML height and width attribute are important for the ratio calculation
     */
    return (

        <img
            src={htmlImageAttributes.src}
            {...(htmlImageAttributes.srcSet != null && {srcSet: htmlImageAttributes.srcSet.join(', ')})}
            alt={imgAttributesProps.alt}
            width={htmlImageAttributes.width}
            height={htmlImageAttributes.height}
            className={clsx(
                className,
                responsiveBehaviour == 'fluid' && 'img-fluid'
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
    responsiveBehaviour?: ImageResponsiveness;
    htmlImageAttributes: HtmlImageAttributes,
} & React.ImgHTMLAttributes<HTMLImageElement>;


/**
 * An Image React component
 */
export default async function Image({
                                        responsiveBehaviour,
                                        compressionLevel,
                                        className,
                                        ratio,
                                        height,
                                        width,
                                        src,
                                        ...imgAttributesProps
                                    }: ImageType) {
    let htmlImageAttributes: HtmlImageAttributes;
    const finalResponsiveBehaviour: ImageResponsiveness = responsiveBehaviour ?? interactConfig.images.defaultValues.responsiveBehaviour;
    const finalCompression = compressionLevel ?? interactConfig.images.defaultValues.compressionLevel;

    if (imgAttributesProps.alt === undefined || imgAttributesProps.alt === null) {
        return BrokenImage({error: new ImageError(ImageErrors.ALT_MISSING)})
    }

    if (src == null) {
        return BrokenImage({error: new ImageError(ImageErrors.SRC_MISSING)})
    }
    try {
        htmlImageAttributes = await getHtmlImageAttributes({
            src: src,
            responsiveBehaviour: finalResponsiveBehaviour,
            compressionLevel: finalCompression,
            width: width,
            height: height,
            ratio: ratio,
        });
    } catch (error) {
        return BrokenImage({error: (error as ImageError)});
    }

    return createImageElement({htmlImageAttributes, ...imgAttributesProps});

}