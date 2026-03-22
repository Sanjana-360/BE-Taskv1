import { AppError } from '../../../middlewares/errors/error'
import { ERROR_CODES } from '../../../middlewares/errors/error.constants'
import Order from '../model/order.model'

const addOrder = async (orderData: any) => {
    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()
    if (!savedOrder) {
        throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, 'Order is not placed')
    }

    return savedOrder
}

const getOrders = async (skip: number, limit: number, filter) => {

    const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    return orders;
}

export default { addOrder, getOrders }