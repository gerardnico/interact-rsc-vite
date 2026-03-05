import React from "react";

import interactConfig from "interact:conf"


import {InteractError, InteractErrorData} from "../errors";

import type {ImageCompressionType} from "../images/image-compression-type";
import type {ImageResponsiveness} from "../config/jsonConfigSchema";
import clsx from "clsx";


export type ImageType =
    React.ImgHTMLAttributes<HTMLImageElement>
    & {
    ratio?: string;
    compressionLevel?: ImageCompressionType;
    responsiveBehaviour?: ImageResponsiveness;
}

type ImageRequestProps = {
    src: string,
    responsiveBehaviour?: ImageResponsiveness,
    compressionLevel?: ImageCompressionType,
    ratio?: string,
    height?: number | string,
    width?: number | string,
}

type Images = {
    src: string,
    srcSet: string[] | undefined,
    width: number,
    height: number,
}

async function getImages(props: ImageRequestProps): Promise<Images> {

    /**
     * Srcset and sizes for responsive image
     * Width is mandatory for responsive image
     * Ref https://developers.google.com/search/docs/advanced/guidelines/google-images#responsive-images
     */
    return {
        src: "_images/card_puncher_data_processing.jpg?r=16:9&w=300&c=low",
        srcSet: undefined,
        width: 300,
        height: 150
    }
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
    const finalResponsiveness: ImageResponsiveness = responsiveBehaviour ?? interactConfig.images.default.responsiveBehaviour;
    const finalCompression = compressionLevel ?? interactConfig.images.default.compressionLevel;
    const finalSrc = src ?? "unknown";


    const optimizedImages = await getImages({
        src: finalSrc,
        responsiveBehaviour: finalResponsiveness,
        compressionLevel: finalCompression,
        width: width,
        height: height,
        ratio: ratio,
    });

    const finalStyle = {
        /**
         * We don't allow the image to scale up by default
         */
        maxHeight: optimizedImages.height,
        /**
         * if the image has a class that has a `height: 100%`, the image will stretch
         */
        height: "auto",
        /**
         * We don't allow the image to scale up by default
         */
        maxWidth: optimizedImages.width,
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
            src={optimizedImages.src}
            srcSet={optimizedImages.srcSet && optimizedImages.srcSet.join(', ')}
            alt={imgAttributesProps.alt}
            width={optimizedImages.width}
            height={optimizedImages.height}
            className={clsx(
                className,
                responsiveBehaviour == 'fluid' && 'img-fluid'
            )}
            {...imgAttributesProps}
            style={finalStyle}
        />

    )

}