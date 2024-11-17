import { model, Schema } from "mongoose";
import { collection } from "../utils/collections.js";

const cartProductSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: collection.Product
    },
    quantity: {
        type: Number,
        default: 1
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: collection.User
    }
}, {
    timestamps: true
});

const CartProductModel = model(collection.CartProduct, cartProductSchema)

export default CartProductModel


