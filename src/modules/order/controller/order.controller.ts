import orderService from '../services/order.service'
import { NextFunction, Request, Response } from 'express';


export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderDetails = req.body;
        const poFile = req.files['poFile'];
        const insDeliveryFile = req.files['insDeliveryFile'];
        const orderWithFiles = {
            poFile,
            insDeliveryFile,
            orderDetails
        };

        const order = await orderService.createOrder(orderWithFiles);
        res.status(201).send(order);
    } catch (error) {
        next(error);
    }
}


const getOrders = async (req: Request, res: Response, next: NextFunction) => {

}

export default { createOrder, getOrders }



