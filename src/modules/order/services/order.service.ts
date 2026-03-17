import { AppError } from '../../../middlewares/errorHandler';
import orderRepository from '../repository/order.repository'
import { s3Upload } from '../../../s3Service';

// validation of products , if present 
// for every product 
// check name , price and qty
const validateProducts = (products: any) => {
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
}


// validate orders
// check for estimateAmount, expectedDeliveryDate 
// [omsOrderId, products are already validated]
const validateOrder = (orderDetails: any, products: any[], estimateAmount: number, poFile: any) => {


    if (!orderDetails.estimateAmount || orderDetails.estimateAmount == '' || orderDetails.estimateAmount < 1) throw new AppError(400, 'estimateAmount is required')
    const totalAmount = products.reduce((sum, product) => {
        return sum + (product.price * product.qty)
    }, 0)

    if (estimateAmount !== totalAmount) {
        throw new AppError(400, 'estimateAmount does not match total price of products')
    }
    if (!orderDetails.expectedDeliveryDate || orderDetails.expectedDeliveryDate == '') {
        throw new AppError(400, 'expectedDeliveryDate is required')
    }
    if (!poFile) throw new AppError(400, 'poFile is required')
}

// flow ->
// 1. destruct orderdetails
// 2. parse products
// 3. parse estimateAmount
// 4. validate Products
// 5. validate Order
// 6. Upload poFile in s3
// 7. Upload indDeliveryFile in s3
const createOrder = async (orderWithFiles) => {

    const { orderDetails, poFile, indDeliveryFile } = orderWithFiles;
    console.log(orderWithFiles);
    const products = JSON.parse(orderDetails.products)
    console.log(products);
    const estimateAmount = Number(orderDetails.estimateAmount)
    validateProducts(products)
    validateOrder(orderDetails, products, estimateAmount, poFile);

    const fileExtension = poFile[0].mimetype.split('/')[1]
    const poFileKey = `sanjana/order/poFiles/po_${Date.now()}.${fileExtension}`
    const poFileUrl = await s3Upload(poFileKey, poFile[0].buffer)

    let indDeliveryFileUrl = null;

    if (indDeliveryFile && indDeliveryFile[0]) {
        const fileExtension = indDeliveryFile[0].mimetype.split('/')[1];
        const indKey = `sanjana/order/indDelivery/ind_${Date.now()}.${fileExtension}`;
        indDeliveryFileUrl = await s3Upload(indKey, indDeliveryFile[0].buffer);
    }
    const order = await orderRepository.addOrder(
        {
            ...orderDetails, products, estimateAmount, poFile: poFileUrl, indDeliveryFile: indDeliveryFileUrl
        }

    );


    return order
}

const getOrders = async (omsOrderId?: string) => {

    const query = omsOrderId;
    const orders = await orderRepository.getOrders(query);
    if (omsOrderId && (!orders && orders.length === 0)) {
        throw new AppError(404, 'No order found with provided omsOrderId');
    }

    return orders;

}


export default { createOrder, getOrders }