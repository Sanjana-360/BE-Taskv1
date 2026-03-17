import Order from '../model/order.model'

const addOrder = async (orderData: any) => {
    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()
    return savedOrder
}

const getOrders = async (query) => {

    const orders = await Order.find(query);
    return orders;
}

export default { addOrder, getOrders }