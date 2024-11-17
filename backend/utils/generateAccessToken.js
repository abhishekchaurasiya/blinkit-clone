import jwt from "jsonwebtoken";

const generateAccessToken = async (userId) => {
  const accessToken = await jwt.sign(
    { id: userId },
    process.env.SECRETE_ACCESS_TOKEN_KEY,
    { expiresIn: "6hr" }
  );
  return accessToken;
};

export default generateAccessToken;
