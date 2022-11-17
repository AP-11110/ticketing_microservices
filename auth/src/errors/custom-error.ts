export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    // must return an array of objects with message and optionally a field
    abstract serializeErrors(): { message: string; field?: string }[]
}