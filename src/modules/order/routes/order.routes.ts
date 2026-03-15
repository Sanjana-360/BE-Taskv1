import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/orders',
    upload.fields([
        { name: 'poFile', maxCount: 5 },
        { name: 'indDeliveryFile', maxCount: 1 }
    ]),
    async (req: Request, res: Response, next: NextFunction) => {


        // const order = await orderService.addOrder(payloadDetails);

    }
)

export default router;