// Shared code constant between the client and server environment

// Framework conventions (arbitrary choices for this demo):
// - The `_.rsc` URL suffix is used to differentiate RSC requests from SSR requests

export const URL_RSC_POSTFIX = '_.rsc'
// On a form, add the `x-rsc-action` header to pass server action ID
export const HEADER_ACTION_ID = 'x-rsc-action'

