import {model, Schema } from "mongoose";
import { collection } from "../utils/collections.js";

const categorySchema = new Schema({
    name: {
        type: String,
        default:""
        // unique: true
    },
    image:{
        type: String,
        default:""
    }
   
}, {timestamps:true});

const Category = model(collection.Category, categorySchema)
export default Category