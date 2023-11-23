import { Request, Response } from "express";
import { User, UserInput } from "../models/user.model";
import { IUserRequest } from "../middlewares/authorization";

type UserType = {
	email: string;
	password: string;
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const reqBody: UserInput = req.body;
		let user = new User(reqBody);
		user = await user.save();
		res.status(201).json({ createdUser: user });
	} catch (error) {
		res.json({ error });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body as UserType;
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		return res
			.cookie("access_token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			})
			.status(200)
			.json({ message: "Logged in successfully 😊 👌", user });
	} catch (error) {
		res.status(400).json({ error });
	}
};

export const getUsers = async (req: IUserRequest, res: Response) => {
	try {
		const me = await User.findById(req.user?.id);
		res.status(201).json(me);
	} catch (error) {
		res.status(500).json({ error });
	}
};
