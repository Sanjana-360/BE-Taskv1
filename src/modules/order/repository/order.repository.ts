import Order from '../model/order.model'

const addOrder = async (orderData: any) => {
    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()
    return savedOrder
}

const getOrders = async (filter) => {

    const orders = await Order.find(filter);
    return orders;
}

export default { addOrder, getOrders }