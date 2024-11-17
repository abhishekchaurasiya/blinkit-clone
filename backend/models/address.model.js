import { model, Schema } from "mongoose";
import { collection } from "../utils/collections.js";

const addressSchema = new Schema({
    address_line: {
        type: String,
        default: ""
        // required: true
    },
    city: {
        type: String,
        default: ""
        // required: true
    },
    state: {
        type: String,
        // required: true
    },
    pinCode: {
        type: String,
        // required: true
    },
    country: {
        type: String,
        // required: true
    },
    mobile: {
        type: Number,
        default: null
    },
    status:{
        type:Boolean,
        default: true
    }
}, { timestamps: true })

const Address = model(collection.Address, addressSchema);
export default Address;