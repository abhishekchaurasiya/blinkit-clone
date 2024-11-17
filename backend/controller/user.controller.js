import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/sendResponse.js";
import {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  CREATED,
  UNAUTHORIZED,
} from "../utils/httpStatucCode.js";
import responseMsg from "../utils/responseMessage.js";
import bcrypt from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import { generateOtp, validateEmail } from "../utils/validatedFunction.js";
import uploadImageCloudinary from "../config/imageCloudinayUpload.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import { userFindbyEmail } from "../services/user.services.js";

userFindbyEmail;

// user register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validateEmail(email)) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.INVALID_EMAIL);
    }

    if (!name || !email || !password) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.All_FIELDS_REQUIRED);
    }

    const userExists = await userFindbyEmail(email);
    if (userExists) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.USER_ALREADY_EXISTS);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new User(payload);
    const savedUser = await newUser.save();

    const verifyEmailUrl = `${process.env.CLIENT_URL
      }/verify-email?code=${savedUser._id.toString()}`;

    // Email verification
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify your email from Blinkit",
      html: verifyEmailTemplate({ name: name, url: verifyEmailUrl }),
    });

    return sendSuccessResponse(res, CREATED, responseMsg.USER_CREATED_SUCCESSFULLY, savedUser);
  } catch (error) {
    return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
  }
};

// email verify
export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById({ _id: code });
    if (!user) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.USER_NOT_FOUND);
    }

    const updateUser = await User.updateOne(
      { _id: code },
      { verify_email: true },
      { new: true, runValidators: true }
    );

    return sendSuccessResponse(res, OK, responseMsg.EMAIL_VERIFIED);
  } catch (error) {
    return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
  }
};

// user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validateEmail(email)) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.INVALID_EMAIL);
    }
    if (!email || !password) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        responseMsg.EMAIL_PASSWORD_ARE_REQUIRED
      );
    }

    const user = await userFindbyEmail(email);
    // if (!user || !user.verify_email) {
    if (!user) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        responseMsg.USER_NOT_REGISTERE
      );
    }

    if (user.status !== "Active") {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.CONTACT_TO_ADMIN);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.INVALID_PASSWORD);
    }

    // I will send token to client two types like access and refreseh token
    // Access token purpose is user login
    // Refreseh token purpose is user life increase the access token
    // access token lifetime 10 minutes or one hour or 10 hours or one day
    // refresh token lifetime 10 days or one month or 1 year

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user?._id);

    // send to cookie
    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookieOption);
    res.cookie("refreshToken", refreshToken, cookieOption);

    return sendSuccessResponse(res, OK, responseMsg.LOGGED_IN_SUCCESSFULLY, {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
  }
};

// user logout
export const logout = async (req, res) => {
  try {
    // only login user access logout
    const userId = req.userId;

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookieOption);
    res.clearCookie("refreshToken", cookieOption);

    const removeRefreshToken = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { refreshToken: "" } },
      { new: true }
    );

    return sendSuccessResponse(res, OK, responseMsg.LOGOUT_SUCCESSFULLY);
  } catch (error) {
    return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
  }
};

// upload user image

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId; // comming from auth middleware
    const image = req.file; // commin from multer middlware

    const upload = await uploadImageCloudinary(image);

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { avatar: upload?.secure_url } },
      { new: true, runValidators: true }
    );

    return sendSuccessResponse(res, OK, responseMsg.UPLOAD_SUCCESSFULL, {
      avatar: upload?.secure_url,
      _id: userId,
    });
  } catch (error) {
    return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
  }
};

// update user details
export const updateDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, password, mobile } = req.body;

    // if (!validateEmail(email)) {
    //   return sendErrorResponse(res, BAD_REQUEST, responseMsg.INVALID_EMAIL);
    // }

    let hashedPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // console.log(object)

    const updateUser = await User.updateOne(
      { _id: userId },
      {
        $set: {
          ...(name && { name: name }),
          ...(email && { email: email }),
          ...(mobile && { mobileNumber: mobile }),
          ...(password && { password: hashedPassword }),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -__v");

    return sendSuccessResponse(
      res,
      OK,
      responseMsg.USER_UPDATE_SUCCESSFULLY,
      updateUser
    );
  } catch (error) {
    return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
  }
};

// forgot password when user not logged in then access this functionalty
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.INVALID_EMAIL);
    }

    // check user
    const user = await User.findOne({ email: email });
    if (!user) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.USER_NOT_FOUND);
    }

    const otp = generateOtp();
    const expireOtp = new Date() + 60 * 60 * 1000; // 1hr

    const update = await User.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: {
          forgot_password_otp: otp,
          forgot_password_expiry: new Date(expireOtp).toISOString(),
        },
      },
      { new: true, runValidators: true }
    );

    // send email
    await sendEmail({
      sendTo: email,
      subject: "Forgot password from Blinkit",
      html: forgotPasswordTemplate({
        name: user?.name,
        otp: otp,
      }),
    });

    return sendSuccessResponse(res, OK, responseMsg.CHECK_YOUR_EMAIL);
  } catch (error) {
    return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
  }
};

// verify otp for forgot password
export const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        responseMsg.PROVIDE_REQUIRED_FIELDS
      );
    }

    if (!validateEmail(email)) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.INVALID_EMAIL);
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.USER_NOT_FOUND);
    }

    const currentTime = new Date().toISOString();
    // const expireTime = new Date(user.forgot_password_expiry);
    if (user?.forgot_password_expiry < currentTime) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.OTP_EXPIRED);
    }

    if (otp !== user?.forgot_password_otp) {
      return sendSuccessResponse(res, BAD_REQUEST, responseMsg.OTP_NOT_MATCHED);
    }

    // if otp is not expired
    // otp === user?.forgot_password_otp
    return sendSuccessResponse(res, OK, responseMsg.OTP_VERIFIED);
  } catch (error) {
    return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
  }
};

// reset the password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        responseMsg.PROVIDE_REQUIRED_REST_FIELDS
      );
    }

    if (!validateEmail(email)) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.INVALID_EMAIL);
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return sendErrorResponse(res, BAD_REQUEST, responseMsg.USER_NOT_FOUND);
    }

    if (newPassword !== confirmPassword) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        responseMsg.PASSWORD_NOT_MATCHED
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const update = await User.findOneAndUpdate(
      { email: email },
      {
        $set: { password: hashedPassword },
      },
      { new: true, runValidators: true }
    );

    return sendSuccessResponse(
      res,
      OK,
      responseMsg.PASSWORD_RESET_SUCCESSFULLY
    );
  } catch (error) {
    return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
  }
};

// uses of refreshToken

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1];
    if (!refreshToken) {
      return sendErrorResponse(res, UNAUTHORIZED, responseMsg.INVALID_TOKEN);
    }

    // refresh token is valid
    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRETE_REFRESH_TOKEN_KEY
    );
    if (!verifyToken) {
      return sendErrorResponse(res, UNAUTHORIZED, responseMsg.TOKEN_EXPIRED);
    }

    const userId = verifyToken?.id;
    const newAccessToken = await generateAccessToken(userId);

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", newAccessToken, cookieOption);

    return sendSuccessResponse(
      res,
      OK,
      responseMsg.NEW_ACCESS_TOKEN_GENERATED,
      {
        accessToken: newAccessToken,
      }
    );
  } catch (error) {
    return sendErrorResponse(res, INTERNAL_SERVER_ERROR, error);
  }
};
