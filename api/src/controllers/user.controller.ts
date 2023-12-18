import { Request, Response } from "express";
import { User, UserInput } from "../models/user.model";
import { IUserRequest, UserData } from "../middlewares/authMiddleware";
import { validOperation } from "../utils/validOperation";

export const createUser = async (req: Request, res: Response) => {
	try {
		const reqBody: UserInput = req.body;
		let user = new User(reqBody);
		user = await user.save();
		const token = user.generateAuthToken();
		res.cookie('access_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		}).status(201).json({ createdUser: user, token });
	} catch (error) {
		res.json({ error });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const password = req.body.password;
		delete req.body.password
		const user = await User.findByCredentials(req.body, password);
		const token = await user.generateAuthToken();
		return res
			.cookie("access_token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			})
			.status(200)
			.json({ message: "Logged in successfully 😊 👌", user, token });
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


export const logoutUser = async (req: IUserRequest, res: Response) => {
	try {
		if(req.user) {
			const currentToken = req.cookies.access_token;
			const user = await User.findById(req.user.id);
			if(user){
				user.tokens = user.tokens.filter((token) => token.token !== currentToken);
				await user.save();
				res.clearCookie("access_token");
				res.status(200).json({message: "User successfully logged out."})
			}
		}else {
			throw {error: "Please Authenticate."}
		}
	}catch(error) {
		res.status(500).json({error})
	}
}

export const logoutFromAllDevice = async (req: IUserRequest, res: Response) => {
	try {
		if(req.user) {
			const user = await User.findById(req.user.id);
			if(user){
				user.tokens = [];
				await user.save();
				res.clearCookie("access_token");
				res.status(200).json({message: "User successfully logged out."})
			}
		}else {
			throw {error: "Please Authenticate."}
		}
	}catch(error) {
		res.status(500).json({error})
	}
}

export const updateUser = async (req: IUserRequest, res: Response) => {
	const allowedFields = ['email', 'username', 'location', 'name', 'password']
	try {
		if(req.user) {
			// const currentToken = req.cookies.access_token;
			const user = await User.findById(req.user.id);
			if(user){
				const updatableFields = validOperation(allowedFields, req.body);
				updatableFields.forEach(async (field) => {
					const field2 = field as keyof  UserData
					user[field2] = req.body[field]
				});
				user.tokens = user.tokens.filter((token) => token.token !== req.cookies.access_token);
				await user.save();
				const token = await user.generateAuthToken();
				console.log(token)
				res.cookie("access_token", token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production"
				}).status(200).json({message: "User successfully updated.", user, token})
			}
		}else {
			throw {error: "Please Authenticate."}
		}
	}catch(error) {
		res.status(500).json({error})
	}
}