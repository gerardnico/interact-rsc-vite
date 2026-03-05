import React, {
    type DetailedHTMLProps,
    type HTMLAttributes,
    type ImgHTMLAttributes,
    type SourceHTMLAttributes
} from "react";



import {InteractError, InteractErrorData} from "../errors";

import * as mime from "mrmime";
import type {ImageCompressionType} from "../images/image-compression-type";
import type {ImageResponsiveness} from "../config/jsonConfigSchema";


const defaultFormats = ['webp'] as const;
const defaultFallbackFormat = 'png' as const;

// Certain formats don't want PNG fallbacks:
// - GIF will typically want to stay as a gif, either for animation or for the lower amount of colors
// - SVGs can't be converted to raster formats in most cases
// - JPEGs compress photographs and high-noise images better than PNG in most cases
// For those, we'll use the original format as the fallback instead.
const specialFormatsFallback = ['gif', 'svg', 'jpg', 'jpeg'] as const;

export declare const VALID_OUTPUT_FORMATS: readonly ["avif", "png", "webp", "jpeg", "jpg", "svg"];
export type ImageOutputFormat = (typeof VALID_OUTPUT_FORMATS)[number] | (string & {});

export type ImageType =
    React.ImgHTMLAttributes<HTMLImageElement>
    & {
    compression?: ImageCompressionType;
    responsiveness?: ImageResponsiveness;
    fallbackFormat?: ImageOutputFormat;
    pictureAttributes?: HTMLAttributes<'picture'>;
}

/**
 * An Image React component based on the Image Service of Astro
 * (Picture.Astro and Image.Astro)
 * Async because this is a server function
 */
export default async function Image({fallbackFormat, ...props}: ImageType) {
    if (props.alt === undefined || props.alt === null) {
        throw new InteractError(InteractErrorData.ImageAltMissing);
    }
    const layout = props.layout ?? imageConfig.layout ?? 'none';
    const useResponsive = layout !== 'none';
    if (useResponsive) {
        // Apply defaults from imageConfig if not provided
        props.layout ??= imageConfig.layout;
        props.fit ??= imageConfig.objectFit ?? 'cover';
        props.position ??= imageConfig.objectPosition ?? 'center';
    }


    const originalSrc = await resolveSrc(props.src);
    const optimizedImages: GetImageResult[] = await Promise.all(
        formats.map(
            async (format) =>
                await getImage({
                    ...props,
                    src: originalSrc,
                    format: format,
                    widths: props.widths,
                    densities: props.densities,
                } as UnresolvedImageTransform),
        ),
    );

    let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
    if (
        !fallbackFormat &&
        isESMImportedImage(originalSrc) &&
        (specialFormatsFallback as ReadonlyArray<string>).includes(originalSrc.format)
    ) {
        resultFallbackFormat = originalSrc.format;
    }
    const fallbackImage = await getImage({
        ...props,
        format: resultFallbackFormat,
        widths: props.widths,
        densities: props.densities,
    } as UnresolvedImageTransform);

    const imgAdditionalAttributes: HTMLAttributes<'img'> = {};
    const sourceAdditionalAttributes: DetailedHTMLProps<SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement> = {};

    // Propagate the `sizes` attribute to the `source` elements
    if (props.sizes) {
        sourceAdditionalAttributes.sizes = props.sizes;
    }

    if (fallbackImage.srcSet.values.length > 0) {
        imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
    }

    if (import.meta.env.DEV) {
        imgAdditionalAttributes['data-image-component'] = 'true';
    }

    const {class: className,  ...attributes} = {
        ...imgAdditionalAttributes,
        ...fallbackImage.attributes,
    };
    const imgAttributes = attributes as React.ImgHTMLAttributes<HTMLImageElement>;

    return (
        <picture>
            {
                Object.entries(optimizedImages).map(([_, image]) => {
                    const srcsetAttribute =
                        props.densities || (!props.densities && !props.widths && !useResponsive)
                            ? `${image.src}${image.srcSet.values.length > 0 ? ', ' + image.srcSet.attribute : ''}`
                            : image.srcSet.attribute;
                    return (
                        <source
                            srcSet={srcsetAttribute}
                            type={mime.lookup(image.options.format ?? image.src) ?? `image/${image.options.format}`}
                            {...sourceAdditionalAttributes}
                        />
                    );
                })
            }
            <img src={fallbackImage.src} alt={props.alt} {...imgAttributes} className={className}/>
        </picture>
    )

}