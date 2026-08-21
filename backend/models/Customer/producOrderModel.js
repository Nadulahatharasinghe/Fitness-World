import mongoose from "mongoose";

const productOrderSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    itemType: {
        type: String,
        required: true, // 'workout' or 'product'
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    }
});

const ProductOrder = mongoose.model("ProductOrder", productOrderSchema);
export default ProductOrder;
