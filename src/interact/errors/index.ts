export {InteractError} from "./InteractError";
export * as InteractErrorData from "./InteractErrorData";


/**
 * Instead of
 * `const err = error as Error`
 * # or
 * String(error)
 * You can use this isError typing
 * @param error
 */
export function isError(error: unknown): error is Error {
    return error instanceof Error;
}