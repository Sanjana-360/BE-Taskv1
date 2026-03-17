
import { ERROR_CODES } from './error.constants';


const appErrors = {
    [ERROR_CODES.BAD_REQUEST]: { status: 400, message: 'Bad request' },
    [ERROR_CODES.NOT_FOUND]: { status: 404, message: 'Not found' },
    [ERROR_CODES.UNAUTHORIZED]: { status: 401, message: 'Unauthorized' },
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: { status: 500, message: 'Internal server error' },
    [ERROR_CODES.TOO_MANY_REQUESTS]: { status: 429, message: 'Too many requests' },
    [ERROR_CODES.SERVICE_UNAVAILABLE]: { status: 503, message: 'Service unavailable' },
    [ERROR_CODES.VALIDATION_ERROR]: { status: 400, message: 'Validation error' },
}
export class AppError extends Error {
    status: number;
    errorList: any;
    constructor(error: string, errorList: any) {
        super(appErrors[error].message);
        this.status = appErrors[error] ? appErrors[error].status : 500;
        this.name = this.constructor.name;
        this.errorList = errorList;
    }

    statusCode() {
        return this.status;
    }
    getErrorList() {
        return this.errorList;
    }
}




export const handleGeneralError = (error: any) => {
    if (error instanceof SyntaxError) {
        // Handling JSON parse errors, etc.
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Syntax error in request');
    } else if (error.code === 'ENOTFOUND') {
        // Handling network errors
        throw new AppError(
            ERROR_CODES.SERVICE_UNAVAILABLE,
            'Network error, service not found',
        );
    } else if (error.code === 'ECONNREFUSED') {
        // Handling connection refused errors
        throw new AppError(ERROR_CODES.SERVICE_UNAVAILABLE, 'Connection refused');
    } else {
        // General unexpected errors
        throw new AppError(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            'Unexpected application error',
        );
    }
};