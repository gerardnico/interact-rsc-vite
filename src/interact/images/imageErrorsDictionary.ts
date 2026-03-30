import {InteractError, type InteractErrorData} from "../errors/InteractError.js";
import {
    ImageCompressionSet,
    ImageFormatCompressionSet,
} from "./imageCompressionType.js";
import {ImageFitSet} from "../config/configSchema.js";

export interface ImageErrorData extends InteractErrorData {
    // http status is mandatory
    status: number;
}

export class ImageError extends InteractError {
    constructor(props: ImageErrorData) {
        super(props)
    }
}

const ResourceNoteFound: ImageErrorData = {
    code: 1001,
    status: 500,
    title: 'Image Not Found',
    message: 'The requested image does not exist.',
    hint: 'Check that the path is correct.',
}
const ImageAltMissing: ImageErrorData = {
    code: 1002,
    status: 400,
    title: '"alt" property is required ',
    message: 'Image missing "alt" property. "alt" text is required to describe important images on the page.',
    hint: 'Use an empty string ("") for decorative images.',
};
const ImageSrcMissing: ImageErrorData = {
    code: 1003,
    status: 400,
    title: 'src is missing',
    message: 'Image missing "src" property'
};
const AvatarIncorrectDimension: ImageErrorData = {
    code: 1004,
    status: 400,
    title: 'Avatar should be squared',
    message: 'Height and width should have the same value',
    hint: 'Use the size parameter instead of height and width value.',
};

const BadHeight: ImageErrorData = {
    code: 1005,
    status: 400,
    title: 'Height value is incorrect',
    message: 'A height should be a positive integer or undefined'
};

const BadWidth: ImageErrorData = {
    code: 1006,
    status: 400,
    title: 'Width value is incorrect',
    message: 'A width should be a positive integer or undefined'
};
const BadRatio: ImageErrorData = {
    code: 1007,
    status: 400,
    title: 'Ratio value is incorrect',
    message: 'A ratio should have 2 positive non-null integers separated by a colon',
    hint: 'For instance, use 16:9, 1:1'
};

const InternalError: ImageErrorData = {
    code: 1008,
    status: 500,
    title: 'An internal error has occurred',
    message: 'Nothing, you can do as a user, sorry',
    hint: 'If the error is transitory, be patient or open a issue'
};

const BadCompression: ImageErrorData = {
    code: 1009,
    status: 400,
    title: 'Compression value is incorrect',
    message: 'A compression value should be one of ' + ImageCompressionSet.options.join(", "),
    hint: 'Use high, you can\'t go wrong'
};

const UnknownType: ImageErrorData = {
    code: 1010,
    status: 400,
    title: 'The content type is unknown',
    message: 'The content type of the format requested is unknown',
    hint: 'You can\'t be wrong using one of the following format: ' + ImageFormatCompressionSet.options.join(", ")
};

const BadFit: ImageErrorData = {
    code: 1011,
    status: 400,
    title: 'Fit value is incorrect',
    message: 'A fit value should be one of ' + ImageFitSet.options.join(", "),
};

const SharpError: ImageErrorData = {
    code: 1012,
    status: 500,
    title: 'Sharp could not read the image file',
    message: 'An unexpected error has occur while trying to read the file with sharp'
};

export const ImageErrors = Object.freeze({
    SHARP_ERROR: SharpError,
    NOT_FOUND: ResourceNoteFound,
    ALT_MISSING: ImageAltMissing,
    SRC_MISSING: ImageSrcMissing,
    AVATAR_INCORRECT_DIMENSION: AvatarIncorrectDimension,
    BAD_HEIGHT: BadHeight,
    BAD_WIDTH: BadWidth,
    BAD_FIT: BadFit,
    BAD_RATIO: BadRatio,
    BAD_COMPRESSION: BadCompression,
    INTERNAL_ERROR: InternalError,
    UNKNOWN_TYPE: UnknownType,
});