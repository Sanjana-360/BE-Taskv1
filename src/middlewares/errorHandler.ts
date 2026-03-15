import { Request, Response, NextFunction } from "express";





class AppError extends Error {
    statusCode: number
    status: string
    isOperational: boolean
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        captureStackTrace: true
    });
}

export { AppError, globalErrorHandler }
