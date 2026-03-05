import React from "react";

import interactConfig from "interact:conf"


import {InteractError, InteractErrorData} from "../errors";

import type {ImageCompressionType} from "../images/image-compression-type";
import type {ImageResponsiveness} from "../config/jsonConfigSchema";
import clsx from "clsx";
import {getHtmlImageAttributes, type HtmlImageAttributes} from "../images/image-client";


export type ImageType =
    React.ImgHTMLAttributes<HTMLImageElement>
    & {
    ratio?: string;
    compressionLevel?: ImageCompressionType;
    responsiveBehaviour?: ImageResponsiveness;
}


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
                                        style,
                                        ...imgAttributesProps
                                    }: ImageType) {
    if (imgAttributesProps.alt === undefined || imgAttributesProps.alt === null) {
        throw new InteractError(InteractErrorData.ImageAltMissing);
    }
    const finalResponsiveBehaviour: ImageResponsiveness = responsiveBehaviour ?? interactConfig.images.defaultValues.responsiveBehaviour;
    const finalCompression = compressionLevel ?? interactConfig.images.defaultValues.compressionLevel;
    const finalSrc = src ?? "unknown";


    let htmlImageAttributes: HtmlImageAttributes;
    try {
        htmlImageAttributes = await getHtmlImageAttributes({
            src: finalSrc,
            responsiveBehaviour: finalResponsiveBehaviour,
            compressionLevel: finalCompression,
            width: width,
            height: height,
            ratio: ratio,
        });
    } catch (error) {
        htmlImageAttributes = {
            height: height as number,
            width: width as number,
            src: src as string,
            srcSet: null,
        }
    }


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
                finalResponsiveBehaviour == 'fluid' && 'img-fluid'
            )}
            {...imgAttributesProps}
            style={finalStyle}
        />

    )

}