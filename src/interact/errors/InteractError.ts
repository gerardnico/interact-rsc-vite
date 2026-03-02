export interface InteractErrorData {
    code: number;
    title: string;
    message?: string | ((...params: any) => string);
    hint?: string | ((...params: any) => string);
}

export class InteractError extends Error {
    code: number;
    title: string;
    hint?: string;

    constructor({code, title, message, hint}: InteractErrorData) {
        super(typeof message === 'string' ? message : message());
        this.code = code;
        this.title = title;
        this.hint = typeof hint === 'string' ? hint : hint();
    }
}



