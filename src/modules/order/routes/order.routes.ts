import { Router } from 'express'
import orderController from '../controller/order.controller'
import multer from 'multer'

const router = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/orders', upload.fields([
    { name: 'poFile', maxCount: 1 },
    { name: 'indDeliveryFile', maxCount: 1 }
]), orderController.createOrder)

router.get('/orders', orderController.getOrders)

export default router