
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendErrorResponse } from "../utils/sendResponse.js";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "../utils/httpStatucCode.js";
import responseMsg from "../utils/responseMessage.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.header?.authorization?.split(" ")[1]; // ["Bearer" "token"]

        if (!token) {
            return sendErrorResponse(res, UNAUTHORIZED, responseMsg.PROIDE_TOKEN)
        }

        const decoded = await jwt.verify(token, process.env.SECRETE_ACCESS_TOKEN_KEY);
        if (!decoded) {
            return sendErrorResponse(res, UNAUTHORIZED, responseMsg.UNAUTHORIZED_ACCESS)
        }

        req.userId = decoded.id;

        next()
    } catch (error) {
        return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
    }
}

export default authMiddleware