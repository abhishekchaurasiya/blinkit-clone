import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// process.env.JWT_SECRET_KEY,
const generateRefreshToken = async (userId) => {
  const token = await jwt.sign(
    { id: userId },
    process.env.SECRETE_REFRESH_TOKEN_KEY,
    {
      expiresIn: "30d",
    }
  );

  const updateRefreshToken = await User.updateOne(
    { _id: userId },
    { $set: { refreshToken: token } },
    { new: true }
  );
  return token;
};

export default generateRefreshToken;
