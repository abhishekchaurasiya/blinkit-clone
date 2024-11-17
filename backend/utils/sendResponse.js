export const sendErrorResponse = (
    res,
    status = 500,
    message,
    success = false
) => {
    if (status === 500) {
        return res
            .status(status)
            .json({ message: message.message || message, success, error: true });
    } else {
        return res.status(status).json({ message, success, error: true });
    }
};

export const sendSuccessResponse = (res, status, message, data) => {
    return res.status(status).json({ message, success: true, error:false, data });
};
