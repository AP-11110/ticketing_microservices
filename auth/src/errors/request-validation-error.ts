import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
    statusCode = 400;


    // public errors: ValidationError[] in the constructor equivalent to:
    // 1. errors: ValidationError[]
    constructor(public errors: ValidationError[]) {
        // 2. this.error = errors
        super('Invalid request parameters');

        // when extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg, field: err.param };
        });
    }
}

