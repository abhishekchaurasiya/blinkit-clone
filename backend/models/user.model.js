import { model, Schema } from "mongoose";
import { collection } from "../utils/collections.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "provide Name"]
    },
    email: {
        type: String,
        required: [true, "provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "provide Password"]
    },
    avatar: {
        type: String,
        default: ""
    },
    mobileNumber: {
        type: Number,
        default: null
        // required: true,
        // unique: true
    },
    refreshToken: {
        type: String,
        default: ""
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type: Date,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: Schema.Types.ObjectId,
            ref: collection.Address,
        }
    ],
    shopping_cart: [
        {
            type: Schema.Types.ObjectId,
            ref: collection.CartProduct,
        }
    ],
    order_history: [
        {
            type: Schema.Types.ObjectId,
            ref: collection.Order,
        }
    ],
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: ""
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
}, { timestamps: true })

const User = model(collection.User, userSchema);

export default User;