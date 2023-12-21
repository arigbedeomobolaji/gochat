import express, { Router } from "express";
import {
	createUser,
	getUser,
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
userRouter.post("/login", loginUser);
userRouter.patch("/logout", authenticateUser, logoutUser)
userRouter.patch("/logoutall", authenticateUser, logoutFromAllDevice);
// userRouter.get('/google', passport.authenticate('google'));
userRouter.get("/:id", authenticateUser, getUser);

export default userRouter;


