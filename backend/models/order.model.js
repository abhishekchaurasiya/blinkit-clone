import { model, Schema } from "mongoose";
import { collection } from "../utils/collections.js";

const categorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: collection.User
    },
    orderId: {
        type: String,
        required: [true, "provide order_id"],
        unique: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: collection.Product
    },
    product_details: {
        name: String,
        image: Array
    },
    paymentId: {
        type: String,
        default: "",
    },
    payment_status: {
        type: String,
        default: "",
    },
    delivery_address: {
        type: Schema.Types.ObjectId,
        ref: collection.Address
    },
    subTotalAmount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    invoice_receipt: {
        type: String,
        default: ""
    }


}, { timestamps: true });

const Order = model(collection.Order, categorySchema)
export default Order