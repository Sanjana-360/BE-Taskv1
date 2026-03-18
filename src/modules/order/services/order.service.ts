import { AppError } from '../../../middlewares/errors/error';
import orderRepository from '../repository/order.repository'
import { s3Upload } from '../../../s3Service';
import { ERROR_CODES } from '../../../middlewares/errors/error.constants';
import { OrderErrors, OrderMessages } from '../constants/order.constants';
import { v4 as uuidv4 } from 'uuid';


// validation of products , if present 
// for every product 
// check name , price and qty
const validateProducts = (products: any) => {
    if (!products || products.length === 0) {
        throw new AppError(ERROR_CODES.BAD_REQUEST, OrderErrors.PRODUCT_REQUIRED)
    }

    for (let product of products) {
        if (!product.name) {
            throw new AppError(ERROR_CODES.BAD_REQUEST, OrderErrors.PRODUCT_NAME_REQUIRED);
        }
        if (!product.price) {
            throw new AppError(ERROR_CODES.BAD_REQUEST, OrderErrors.PRODUCT_PRICE_REQUIRED)
        }
        if (product.price < 1) {
            throw new AppError(ERROR_CODES.NOT_ACCEPTABLE, 'Please enter a value greater than 1')
        }
        if (!product.qty || product.qty == 0) {
            throw new AppError(ERROR_CODES.BAD_REQUEST, OrderErrors.PRODUCT_QTY_REQUIRED)
        }
    }
}


// validate orders
// check for estimateAmount, expectedDeliveryDate 
// [omsOrderId, products are already validated]
const validateOrder = (orderDetails: any, products: any[], estimateAmount: number, poFiles: any) => {


    if (!orderDetails.estimateAmount || orderDetails.estimateAmount == '' || orderDetails.estimateAmount < 1) throw new AppError(ERROR_CODES.BAD_REQUEST, 'estimateAmount is required')
    const totalAmount = products.reduce((sum, product) => {
        return sum + (product.price * product.qty)
    }, 0)

    if (estimateAmount !== totalAmount) {
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'estimateAmount does not match total price of products')
    }
    if (!orderDetails.expectedDeliveryDate || orderDetails.expectedDeliveryDate == '') {
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'expectedDeliveryDate is required')
    }
    // if (!poFiles || poFiles.length <= 0) throw new AppError(ERROR_CODES.BAD_REQUEST, OrderErrors.PO_FILE_REQUIRED)
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

    const { orderDetails, poFiles, indDeliveryFile } = orderWithFiles;
    console.log(orderWithFiles);
    const products = JSON.parse(orderDetails.products)
    console.log('parsed products:', JSON.stringify(products, null, 2))
    const estimateAmount = Number(orderDetails.estimateAmount)
    const expectedDeliveryDate = new Date(orderDetails.expectedDeliveryDate);
    validateProducts(products)
    validateOrder(orderDetails, products, estimateAmount, poFiles);
    const uniqueId = uuidv4();

    const poFileUrls = [];

    for (const poFile of (poFiles || [])) {
        const fileExtension = poFile.mimetype.split('/')[1]

        if (!fileExtension) {
            throw new AppError(ERROR_CODES.NOT_ACCEPTABLE, `Could not determine file extension from mimetype: ${poFile.mimetype}`)
        }
        const key = `sanjana/order/poFiles/po_${Date.now()}_${uniqueId}.${fileExtension}`
        const poFileUrl = await s3Upload(key, poFile.buffer)
        poFileUrls.push(poFileUrl)
    }


    let indDeliveryFileUrl = null;

    if (indDeliveryFile && indDeliveryFile[0]) {
        const fileExtension = indDeliveryFile[0].mimetype.split('/')[1];
        const indKey = `sanjana/order/indDelivery/ind_${Date.now()}.${fileExtension}`;
        indDeliveryFileUrl = await s3Upload(indKey, indDeliveryFile[0].buffer);
    }
    const order = await orderRepository.addOrder(
        {
            ...orderDetails, products, estimateAmount, expectedDeliveryDate, poFiles: poFileUrls, indDeliveryFile: indDeliveryFileUrl
        }

    );


    return order
}

const getOrders = async (omsOrderId?: string) => {

    const filter = omsOrderId ? { omsOrderId: omsOrderId } : {};
    const orders = await orderRepository.getOrders(filter);
    if (omsOrderId && (!orders && orders.length === 0)) {
        throw new AppError(ERROR_CODES.REQUEST_DID_NOT_MATCH, OrderErrors.NOT_FOUND);
    }
    console.log(OrderMessages.FETCHED)
    return orders;

}


export default { createOrder, getOrders }