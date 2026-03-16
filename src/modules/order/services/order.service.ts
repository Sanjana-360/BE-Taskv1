import { AppError } from '../../../middlewares/errorHandler';
import orderRepository from '../repository/order.repository'
// import { s3Upload } from '../../../s3Service';
const validateProducts = (products: any) => {
    try {
        if (!products || products.length === 0) {
            throw new Error()
        }

        for (let product of products) {
            if (!product.name) {
                throw new AppError(404, '')
            }
            if (!product.price) {
                throw new AppError(404, '')
            }
            if (!product.qty) {
                throw new AppError(404, '')
            }
        }
    } catch (error) {
        throw new AppError(404, '')
    }

}


const validateOrder = (orderDetails: any, products: any[], estimateAmount: number) => {


    if (!orderDetails.estimateAmount || orderDetails.estimateAmount == '' || orderDetails.estimateAmount < 1) throw new AppError(400, 'estimateAmount is required')
    const totalAmount = products.reduce((sum, product) => {
        return sum + (product.price * product.qty)
    }, 0)

    if (estimateAmount !== totalAmount) {
        throw new AppError(400, 'estimateAmount does not match total price of products')
    }
    if (!orderDetails.expectedDeliveryDate) throw new AppError(400, 'expectedDeliveryDate is required')
}


const createOrder = async (orderWithFiles) => {
    try {
        const { orderDetails, poFile, indDeliveryFile } = orderWithFiles;
        const products = JSON.parse(orderDetails.products)
        const estimateAmount = Number(orderDetails.estimateAmount)
        validateProducts(products)
        validateOrder(orderDetails, products, estimateAmount);
        const fileExtension = poFile[0].mimetype.split('/')[1]
        const poFileKey = `order/poFiles/po_${orderDetails.omsOrderId}.${fileExtension}`
        // const poFileUrl = await s3Upload(poFileKey, poFile[0].buffer)

        let indDeliveryFileUrl = null
        if (indDeliveryFile) {
            const ext = indDeliveryFile[0].mimetype.split('/')[1]
            const indKey = `order/indDelivery/ind_${orderDetails.omsOrderId}.${ext}`
            // indDeliveryFileUrl = await s3Upload(indKey, indDeliveryFile[0].buffer)
        }
        const order = await orderRepository.addOrder(
            {
                // ...orderDetails, products, estimateAmount, poFile: poFileUrl, indDeliveryFile: indDeliveryFileUrl
            }

        );

        return order


    } catch (error) {
        throw new AppError(400, 'Bad Request');
    }




}

const getOrders = async (orderDetails) => {

}


export default { createOrder, getOrders }