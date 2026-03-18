import orderService from '../services/order.service'
import { NextFunction, Request, Response } from 'express';
import { AppError, handleGeneralError } from '../../../middlewares/errors/error';
import { ERROR_CODES } from '../../../middlewares/errors/error.constants'
import { OrderMessages } from '../constants/order.constants';
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderDetails = req.body;
        const poFiles = req.files['poFiles'];
        const indDeliveryFile = req.files['indDeliveryFile'];
        const orderWithFiles = {
            orderDetails,
            poFiles,
            indDeliveryFile
        };

        const order = await orderService.createOrder(orderWithFiles);
        res.status(201).send(order);
    } catch (error) {
        console.error(error);
        if (
            error.errors &&
            error.errors.length > 0 &&
            !(error.original && error.original.code)
        ) {
            throw new AppError(ERROR_CODES.BAD_REQUEST, error.errors[0].message);
        } else {
            if (error instanceof AppError) {
                next(error);
            }
            next(handleGeneralError(error));
        }
        next(error);
    }
}


const getOrders = async (req: Request, res: Response, next: NextFunction) => {


    try {
        const omsOrderId = req.query.omsOrderId as string;
        const orders = await orderService.getOrders(omsOrderId);
        res.status(200).json({
            data: orders,
            success: true
        })
    } catch (error) {
        console.error(error);
        if (
            error.errors &&
            error.errors.length > 0 &&
            !(error.original && error.original.code)
        ) {
            throw new AppError(ERROR_CODES.BAD_REQUEST, error.errors[0].message);
        } else {
            if (error instanceof AppError) {
                throw error;
            }
            handleGeneralError(error);
        }
        next(error);
    }

}

export default { createOrder, getOrders }




