import { Router } from 'express'
import orderController from '../controller/order.controller'
import multer from 'multer'

const router = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.fields([
    { name: 'poFiles', maxCount: 1 },
    { name: 'indDeliveryFile', maxCount: 1 }
]), orderController.createOrder)

router.get('/', orderController.getOrders)

export default router