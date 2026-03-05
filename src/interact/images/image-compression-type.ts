import sharp, {type FormatEnum} from 'sharp';
import {z} from "zod";

export const ImageCompressionSchema = z.enum(['low', 'mid', 'high', 'max', 'none']);
export type ImageCompressionType = z.output<typeof ImageCompressionSchema>;

/**
 * Key of the low objects
 */
export const ImageFormatWithPreset = z.enum(['jpeg', 'png', 'webp', 'avif', 'tiff', 'gif', 'heif']);

type ImageFormatWthPresetType = z.output<typeof ImageFormatWithPreset>

export const COMPRESSION_PRESETS: Record<ImageCompressionType, {
    jpeg: sharp.JpegOptions;
    png: sharp.PngOptions;
    webp: sharp.WebpOptions;
    avif: sharp.AvifOptions;
    tiff: sharp.TiffOptions;
    gif: sharp.GifOptions;
    heif: sharp.HeifOptions;
}> = {
    low: {
        jpeg: {compression: 40, mozjpeg: true, progressive: false, chromaSubsampling: '4:2:0'},
        png: {compression: 40, compressionLevel: 9, effort: 1, palette: true},
        webp: {compression: 40, effort: 1, smartSubsample: true, nearLossless: false},
        avif: {compression: 50, effort: 2, chromaSubsampling: '4:2:0'},
        tiff: {compressionType: 40, compressionType: 'jpeg', predictor: 'horizontal'},
        gif: {effort: 1, colours: 64},
        heif: {compressionType: 40, effort: 2, compressionType: 'hevc'},
    },
    mid: {
        jpeg: {compression: 65, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0'},
        png: {compression: 65, compressionLevel: 7, effort: 4, palette: false},
        webp: {compression: 65, effort: 4, smartSubsample: true, nearLossless: false},
        avif: {compression: 55, effort: 4, chromaSubsampling: '4:2:0'},
        tiff: {compressionType: 65, compressionType: 'jpeg', predictor: 'horizontal'},
        gif: {effort: 5, colours: 128},
        heif: {compressionType: 55, effort: 4, compressionType: 'hevc'},
    },
    high: {
        jpeg: {compression: 82, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4'},
        png: {compression: 85, compressionLevel: 6, effort: 7, palette: false},
        webp: {compression: 82, effort: 6, smartSubsample: false, nearLossless: false},
        avif: {compression: 70, effort: 6, chromaSubsampling: '4:4:4'},
        tiff: {compressionType: 82, compressionType: 'lzw', predictor: 'horizontal'},
        gif: {effort: 7, colours: 200},
        heif: {compressionType: 70, effort: 6, compressionType: 'hevc'},
    },

    max: {
        jpeg: {compression: 95, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4'},
        png: {compression: 100, compressionLevel: 0, effort: 10, palette: false},
        webp: {compression: 95, effort: 6, smartSubsample: false, nearLossless: true},
        avif: {compression: 90, effort: 9, chromaSubsampling: '4:4:4'},
        tiff: {compressionType: 95, compressionType: 'none', predictor: 'none'},
        gif: {effort: 10, colours: 256},
        heif: {compressionType: 90, effort: 9, compressionType: 'hevc'},
    },
    none: {
        jpeg: {},
        png: {},
        webp: {},
        avif: {},
        tiff: {},
        gif: {},
        heif: {},
    }
};


export function getPresetOptions({
                                     format,
                                     preset = 'high'
                                 }: {
                                     format: keyof FormatEnum,
                                     preset: ImageCompressionType
                                 }
) {

    const supported: ImageFormatWthPresetType[] = ['jpeg', 'png', 'webp', 'avif', 'tiff', 'gif', 'heif'];
    const include = supported.includes(format as ImageFormatWthPresetType) ? (format as ImageFormatWthPresetType) : null;
    if (!include) {
        // Fall back to Sharp's defaults for unsupported formats (e.g. raw, tile, dz)
        return {}
    }
    return COMPRESSION_PRESETS[preset][format as ImageFormatWthPresetType];
}