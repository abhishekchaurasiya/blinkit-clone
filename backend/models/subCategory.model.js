import { model, Schema } from "mongoose";
import { collection } from "../utils/collections.js";

const subCategorySchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    categoryId: [
        {
            type: Schema.Types.ObjectId,
            ref: collection.Category
        }
    ]
}, { timestamps: true });

const Category = model(collection.SubCategory, subCategorySchema)
export default Category

