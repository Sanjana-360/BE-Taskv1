import DOT_ENV from '../../../config-env'
import { AppError } from '../../../middlewares/errors/error'
import { ERROR_CODES } from '../../../middlewares/errors/error.constants'
import { sendEmail } from '../../../sendEmail.service'
import { orderConfirmedEmailTemplate } from '../../../utils/templates/order-confirmed-client-template'
import Order from '../model/order.model'

const addOrder = async (orderData: any) => {
    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()
    if (!savedOrder) {
        throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, 'Order is not placed')
    }

    const ccPersons = ["chinmaysabnis.360tech@gmail.com", "sanjana+operationExecutive@gmail.com", "sanjana+purchaseExecutive@gmail.com"]
    const senderEmail = "sanjana.360tech@gmail.com"
    const senderPassword = DOT_ENV.SENDERPASSWORD
    const receiverEmail = "sanjana.360tech+admin@gmail.com"
    const mailBody = {
        from: senderEmail,
        to: receiverEmail,
        subject: `New Order Placed - ${savedOrder.omsOrderId}`,
        content: orderConfirmedEmailTemplate({
            omsOrderId: savedOrder.omsOrderId,
            estimateAmount: savedOrder.estimateAmount,
            expectedDeliveryDate: savedOrder.expectedDeliveryDate,
            products: savedOrder.products
        })
    };

    sendEmail(
        receiverEmail,
        mailBody.subject,
        mailBody.content,
        senderEmail,
        senderPassword,
        ccPersons
    );
    return savedOrder
}

const getOrders = async (filter) => {

    const orders = await Order.find(filter);
    return orders;
}

export default { addOrder, getOrders }