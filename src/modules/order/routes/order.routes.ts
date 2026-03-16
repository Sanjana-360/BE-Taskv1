import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import orderService from '../services/order.service';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/orders',
    upload.fields([
        { name: 'poFile', maxCount: 5 },
        { name: 'insDeliveryFile', maxCount: 1 }
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderDetails = req.body;
            const poFile = req.file['poFile'];
            const insDeliveryFile = req.file['insDeliveryFile'];
            const orderWithFiles = {
                poFile,
                insDeliveryFile,
                orderDetails
            };

            const order = await orderService.addOrder(orderWithFiles);
            res.status(201).send(order);
        } catch (error) {
            next(error);
        }


    }
)

router.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderDetails = req.body;
        const orders = await orderService.getOrder(orderDetails);
        res.status(200).send(orders);
    } catch (error) {
        next(error);
    }
});

export default router;