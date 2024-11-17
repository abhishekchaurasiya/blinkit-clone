import User from "../models/user.model.js";

export async function userFindbyEmail(email) {
    return await User.findOne({ email: email }).exec();
}

