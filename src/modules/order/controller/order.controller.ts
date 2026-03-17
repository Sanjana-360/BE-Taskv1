import orderService from '../services/order.service'
import { NextFunction, Request, Response } from 'express';


export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderDetails = req.body;
        const poFile = req.files['poFile'];
        const indDeliveryFile = req.files['indDeliveryFile'];
        const orderWithFiles = {
            poFile,
            indDeliveryFile,
            orderDetails
        };

        const order = await orderService.createOrder(orderWithFiles);
        res.status(201).send(order);
    } catch (error) {
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
        next(error);
    }

}

export default { createOrder, getOrders }




