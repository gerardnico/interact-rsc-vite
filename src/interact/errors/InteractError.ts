export interface InteractErrorData {
    code: number;
    title: string;
    status?: number;
    message?: string | ((...params: any) => string);
    hint?: string | ((...params: any) => string);
    options?: ErrorOptions
}

function getString(message: string | ((...params: any) => string) | undefined) {
    if (!message) {
        return ''
    }
    return typeof message === 'string' ? message : message()
}

export class InteractError extends Error {
    code: number;
    title: string;
    hint?: string;
    status?: number;

    constructor({code, title, message, hint, status, options}: InteractErrorData) {
        super(getString(message), options);
        this.code = code;
        this.title = title;
        this.hint = getString(hint);
        this.status = status;
    }
}



