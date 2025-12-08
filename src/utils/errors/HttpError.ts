export class HttpError extends Error {
    constructor(
        public status: number,
        public error: string,
        public message: string = error,
        public details: string | null = null
    ) {
        super(message);

        this.status = status;
        this.error = error;
        this.message = message;
        this.details = details;

        this.name = "HttpError";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        };
    };
};