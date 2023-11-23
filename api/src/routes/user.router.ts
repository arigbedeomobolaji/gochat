import express, { Router } from "express";
import {
	createUser,
	getUsers,
	loginUser,
} from "../controllers/user.controller";
import { authorization } from "../middlewares/authorization";
const userRouter: Router = express.Router();

userRouter.post("", createUser);
userRouter.post("/login", loginUser);
userRouter.get("", authorization, getUsers);

export default userRouter;
