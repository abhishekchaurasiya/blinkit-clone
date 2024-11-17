import express from "express";
import {
  forgotPassword,
  login,
  logout,
  refreshTokenController,
  registerUser,
  resetPassword,
  updateDetails,
  uploadAvatar,
  verifyEmail,
  verifyForgotPasswordOTP,
} from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/logout", authMiddleware, logout);
router.put(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);
router.put("/update-details", authMiddleware, updateDetails);
router.put("/forgot-password", forgotPassword);
router.put("/verify-forgot-password-otp", verifyForgotPasswordOTP);
router.put("/reset-password", resetPassword);
router.post("/refresh-token", refreshTokenController);

export default router;
