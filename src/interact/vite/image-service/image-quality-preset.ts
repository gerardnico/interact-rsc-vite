import sharp, {type FormatEnum} from 'sharp';
import {z} from "zod";

export const ImageQualityPresetSchema = z.enum(['low', 'mid', 'high' , 'max']);
export type ImageQualityPreset = z.output<typeof ImageQualityPresetSchema>;

/**
 * Key of the low objects
 */
export const QualityPresetFormat = z.enum(['jpeg' , 'png' , 'webp' , 'avif' , 'tiff' , 'gif' , 'heif']);

type QualityPresetFormats = z.output<typeof QualityPresetFormat>

export const SHARP_QUALITY_PRESETS: Record<ImageQualityPreset, {
    jpeg: sharp.JpegOptions;
    png: sharp.PngOptions;
    webp: sharp.WebpOptions;
    avif: sharp.AvifOptions;
    tiff: sharp.TiffOptions;
    gif: sharp.GifOptions;
    heif: sharp.HeifOptions;
}> = {
    low: {
        jpeg: {quality: 40, mozjpeg: true, progressive: false, chromaSubsampling: '4:2:0'},
        png: {quality: 40, compressionLevel: 9, effort: 1, palette: true},
        webp: {quality: 40, effort: 1, smartSubsample: true, nearLossless: false},
        avif: {quality: 50, effort: 2, chromaSubsampling: '4:2:0'},
        tiff: {quality: 40, compression: 'jpeg', predictor: 'horizontal'},
        gif: {effort: 1, colours: 64},
        heif: {quality: 40, effort: 2, compression: 'hevc'},
    },

    mid: {
        jpeg: {quality: 65, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0'},
        png: {quality: 65, compressionLevel: 7, effort: 4, palette: false},
        webp: {quality: 65, effort: 4, smartSubsample: true, nearLossless: false},
        avif: {quality: 55, effort: 4, chromaSubsampling: '4:2:0'},
        tiff: {quality: 65, compression: 'jpeg', predictor: 'horizontal'},
        gif: {effort: 5, colours: 128},
        heif: {quality: 55, effort: 4, compression: 'hevc'},
    },

    high: {
        jpeg: {quality: 82, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4'},
        png: {quality: 85, compressionLevel: 6, effort: 7, palette: false},
        webp: {quality: 82, effort: 6, smartSubsample: false, nearLossless: false},
        avif: {quality: 70, effort: 6, chromaSubsampling: '4:4:4'},
        tiff: {quality: 82, compression: 'lzw', predictor: 'horizontal'},
        gif: {effort: 7, colours: 200},
        heif: {quality: 70, effort: 6, compression: 'hevc'},
    },

    max: {
        jpeg: {quality: 95, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4'},
        png: {quality: 100, compressionLevel: 0, effort: 10, palette: false},
        webp: {quality: 95, effort: 6, smartSubsample: false, nearLossless: true},
        avif: {quality: 90, effort: 9, chromaSubsampling: '4:4:4'},
        tiff: {quality: 95, compression: 'none', predictor: 'none'},
        gif: {effort: 10, colours: 256},
        heif: {quality: 90, effort: 9, compression: 'hevc'},
    },
};


export function getPresetOptions({
                                     format,
                                     preset = 'high'
                                 }: {
                                     format: keyof FormatEnum,
                                     preset: ImageQualityPreset
                                 }
) {

    const supported: QualityPresetFormats[] = ['jpeg', 'png', 'webp', 'avif', 'tiff', 'gif', 'heif'];
    const include = supported.includes(format as QualityPresetFormats) ? (format as QualityPresetFormats) : null;
    if (!include) {
        // Fall back to Sharp's defaults for unsupported formats (e.g. raw, tile, dz)
        return {}
    }
    return SHARP_QUALITY_PRESETS[preset][format as QualityPresetFormats];
}