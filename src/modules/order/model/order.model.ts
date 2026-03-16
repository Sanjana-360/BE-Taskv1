import mongoose from 'mongoose'
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    price: {
        type: Number,
        required: [true, "Price of the product is required"],
        default: 0
    },
    qty: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    omsOrderId: {
        type: String,
        required: [true, "OmsOrderId is required"],
        unique: true
    },
    estimateAmount: {
        type: Number,
        required: true,
        default: 0
    },
    poFile: {
        type: String,
        required: [true, "PoFile is required"]
    },
    products: [productSchema],
    expectedDeliveryDate: {
        type: Date,
        default: Date.now
    },
    insDeliveryFile: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export default orderSchema;