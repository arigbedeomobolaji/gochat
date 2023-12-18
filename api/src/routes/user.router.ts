import express, { Router } from "express";
import {
	createUser,
	getUsers,
	loginUser,
	logoutFromAllDevice,
	logoutUser,
	updateUser,
} from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/authMiddleware";
import passport from "passport";
const userRouter: Router = express.Router();

userRouter.post("", createUser);
userRouter.patch("", authenticateUser, updateUser);
userRouter.get("", authenticateUser, getUsers);
userRouter.post("/login", loginUser);
userRouter.patch("/logout", authenticateUser, logoutUser)
userRouter.patch("/logoutall", authenticateUser, logoutFromAllDevice);
userRouter.get('/google', passport.authenticate('google'));

export default userRouter;


