import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const statusCode = error.status || error.statusCode || 500;
    const errorDetail = error.errorList || error.message || 'Internal Server Error';
    console.error(`Error at ${req.method} ${req.path}:`, errorDetail);
    res.status(statusCode).json({
        success: false,
        error: {
            message: error.message || 'An unexpected error occurred',
            details: errorDetail,
            statusCode: statusCode,
            path: req.originalUrl,
            timestamp: new Date().toISOString()
        }
    });
};