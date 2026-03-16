import Order from '../model/order.model'

const addOrder = async (orderData: any) => {
    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()
    return savedOrder
}

const getOrders = async (omsOrderId?: string) => {
    const query = omsOrderId ? { omsOrderId } : {}
    return await Order.find(query)
}

export default { addOrder, getOrders }