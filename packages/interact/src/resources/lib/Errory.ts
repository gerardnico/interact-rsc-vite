/**
 * A utility class that wraps an error
 */
export class Errory {

    private readonly error: Error | object | string | unknown;
    private serverErrorDetected = false;
    private errorMessage: string = '';

    constructor(error: Error | object | string | unknown) {
        this.error = error;
        this.parse();
    }

    parse() {
        const type = typeof this.error;
        switch (type) {
            case 'string': {
                this.errorMessage = this.error as string;
                return;
            }
            case "object": {
                const errorAsObject = this.error as object;
                if (errorAsObject != null && "statusText" in errorAsObject) {
                    /**
                     * React Router error:
                     * https://reactrouter.com/en/main/utils/is-route-error-response
                     * error.status === "number" &&
                     * error.statusText === "string" &&
                     * error.internal === "boolean" &&
                     * "data" in error
                     */
                    this.errorMessage = errorAsObject.statusText as string;
                    return;
                }
                if (errorAsObject instanceof Error) {
                    this.errorMessage = errorAsObject.message;
                    return;
                }

                this.errorMessage = JSON.stringify(this.error);
                return;
            }
            default: {
                console.error(this.error);
                this.errorMessage = 'Unknown error type (' + type + ")";
                return;
            }

        }

    }

    getStackTrace() {
        if (this.error instanceof Error) {
            return (this.error as Error)?.stack
        }
        return 'The error has no stack trace';
    }


    isServerError() {
        return this.serverErrorDetected;
    }

    getMessage() {
        return this.errorMessage;
    }

    getAsJson() {
        return JSON.stringify(this.error);
    }

}
