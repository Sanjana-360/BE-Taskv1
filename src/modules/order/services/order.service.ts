import { AppError } from '../../../middlewares/errorHandler';
import orderRepository from '../repository/order.repository'

const validateProducts = async (products: any) => {
    try {
        if (!products || products.length === 0) {
            throw new Error()
        }

        products.map((products) => {
            if (!products.name) {
                throw new Error()
            }

            if (!products.price) {
                throw new Error()
            }

            if (!products.qty) {
                throw new Error()
            }
        })
    } catch (error) {
        throw new AppError(error, 200)
    }

}

const createOrder = async (orderWithFiles) => {
    try {
        const { orderDetails, poFile, insDeliveryFile } = orderWithFiles;
        if (!orderDetails.omsOrderId) throw new AppError('omsOrderId is required', 400)
        if (!orderDetails.estimateAmount) throw new AppError('estimateAmount is required', 400)
        if (!orderDetails.expectedDeliveryDate) throw new AppError('expectedDeliveryDate is required', 400)
        if (!poFile) throw new AppError('poFile is required', 400)
        const products = JSON.parse(orderDetails.products)
        const estimateAmount = Number(orderDetails.estimateAmount)
        await validateProducts(products);



    } catch (error) {
        throw error;
    }




}

const getOrders = async (orderDetails) => {

}


export default { createOrder, getOrders }