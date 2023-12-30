import express, { Router } from "express";
import {
  createUser,
  getUser,
  loginUser,
  logoutFromAllDevice,
  logoutUser,
  otherUsers,
  updateUser,
} from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/authMiddleware";
import passport from "passport";
const userRouter: Router = express.Router();

userRouter.post("", createUser);
userRouter.patch("", authenticateUser, updateUser);
userRouter.post("/login", loginUser);
userRouter.patch("/logout", authenticateUser, logoutUser);
userRouter.patch("/logoutall", authenticateUser, logoutFromAllDevice);
userRouter.get("/otherusers", authenticateUser, otherUsers);
userRouter.get("/:id", authenticateUser, getUser);

export default userRouter;
