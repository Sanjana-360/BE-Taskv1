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
        unique: true
    },
    estimateAmount: {
        type: Number,
        required: true,
        default: 0
    },

    poFiles: {
        type: [String],
        required: [true, "PoFile is required"]
    },
    products: [productSchema],
    expectedDeliveryDate: {
        type: Date,
        default: null
    },
    indDeliveryFile: {
        type: String,
        default: ''
    }
}, { timestamps: true });


orderSchema.pre('save', async function () {
    if (!this.omsOrderId) {
        this.omsOrderId = `OMS-${Date.now()}`
    }
})
const Order = mongoose.model('Order', orderSchema);


export default Order;