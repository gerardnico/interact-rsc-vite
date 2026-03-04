export interface InteractErrorData {
    code: number;
    title: string;
    message?: string | ((...params: any) => string);
    hint?: string | ((...params: any) => string);
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

    constructor({code, title, message, hint}: InteractErrorData) {
        super(getString(message));
        this.code = code;
        this.title = title;
        this.hint = getString(hint);
    }
}



