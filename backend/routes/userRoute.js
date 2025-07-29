import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getUserInfo,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/info", authUser, getUserInfo);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;
