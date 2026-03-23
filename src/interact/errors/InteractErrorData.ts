import type {InteractErrorData} from "./InteractError.js";

const ResourceNoteFound: InteractErrorData = {
    code: 1001,
    title: 'Resource Not Found',
    message: 'The requested resource does not exist.',
    hint: 'Check that the path is correct.',
}
const ImageAltMissing: InteractErrorData = {
    code: 1002,
    title: 'Image missing required "alt" property.',
    message: 'Image missing "alt" property. "alt" text is required to describe important images on the page.',
    hint: 'Use an empty string ("") for decorative images.',
};

// noinspection JSUnusedGlobalSymbols - not true, we export it
const AvatarIncorrectDimension: InteractErrorData = {
    code: 1003,
    title: 'An avatar image should have the same height and width value',
    message: 'Height and width do not have the same value',
    hint: 'Use the size parameter instead of height and width value.',
};

// noinspection JSUnusedGlobalSymbols
/**
 * To avoid
 * Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components.
 * Classes or null prototypes are not supported.
 */
// noinspection JSUnusedGlobalSymbols - not true, we export it
const PageWithNullAsDefault: InteractErrorData = {
    code: 1004,
    message: 'The page has no default export. Null was found.',
    title: 'A page component should have a default export',
    hint: 'Set the default qualifier in front of your page function component',
};

export {
    ResourceNoteFound,
    ImageAltMissing,
    AvatarIncorrectDimension,
    PageWithNullAsDefault,
}