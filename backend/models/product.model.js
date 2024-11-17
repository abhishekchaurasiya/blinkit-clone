import { model, Schema } from "mongoose";
import { collection } from "../utils/collections.js";

const productSchem = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        default: [],
    },
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: collection.Category
        },
    ],
    sub_category: [
        {
            type: Schema.Types.ObjectId,
            ref: collection.SubCategory
        },
    ],
    unit: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: 0
    },

    price: {
        type: Number,
        default: null
    },
    discount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ""
    },
    more_details: {
        type: Object,
        default: {}
    },
    publish: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Product = model(collection.Product, productSchem);
export default Product;