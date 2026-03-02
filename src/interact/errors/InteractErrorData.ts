import {InteractErrorData} from "./InteractError";

const ResourceNoteFound: InteractErrorData = {
    code: 1001,
    title: 'Resource Not Found',
    message: 'The requested resource does not exist.',
    hint: 'Check that the ID is correct.',
}
const ImageAltMissing: InteractErrorData = {
    code: 1002,
    title: 'Image missing required "alt" property.',
    message: 'Image missing "alt" property. "alt" text is required to describe important images on the page.',
    hint: 'Use an empty string ("") for decorative images.',
};
const AvatarIncorrectDimension: InteractErrorData = {
    code: 1003,
    title: 'An avatar image should have the same height and width value',
    message: 'Height and width do not have the same value',
    hint: 'Use the size parameter instead of height and width value.',
};

export {
    ResourceNoteFound,
    ImageAltMissing,
    AvatarIncorrectDimension
}