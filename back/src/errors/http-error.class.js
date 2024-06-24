export class HTTPError extends Error {
    constructor(statusCode, message, context) {
        super(message);
        this.statusCode = statusCode;
        this.context = context;
    }
}