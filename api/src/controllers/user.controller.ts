import { NextFunction, Request, Response } from "express";
import { User, UserInput } from "../models/user.model";
import { IUserRequest, UserData } from "../middlewares/authMiddleware";
import { validOperation } from "../utils/validOperation";
import { nextTick } from "process";
import createHttpError from "http-errors";
import { expiresIn } from "../utils";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const reqBody: UserInput = req.body;
		let user = new User(reqBody);
		user = await user.save();
		const token =await  user.generateAuthToken();
		res.cookie('access_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			expires: new Date(Date.now() + expiresIn)
		}).status(201).json({ user, token });
	} catch (error: any) {
		if(error.name.toLowerCase().includes('mongo')) {
			next(createHttpError.BadRequest("username and email must be unique"))
		}
		next(error);
	}
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const password = req.body.password;
		delete req.body.password
		const user = await User.findByCredentials(req.body.usernameOrEmail, password);
		const token = await user.generateAuthToken();
		return res
			.cookie("access_token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				expires: new Date(Date.now() + expiresIn)
			})
			.status(200)
			.json({ message: "Logged in successfully 😊 👌", user, token });
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req: IUserRequest, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id
		const user = await User.findById(id);
		console.log(user, "getUser")
		if(!user) {
			throw createHttpError.Unauthorized("Please Authenticate");
		}	
		res.status(201).json(req.user);
	} catch (error) {
		next(createHttpError.Unauthorized("Please Login to view page"));
	}
};


export const logoutUser = async (req: IUserRequest, res: Response, next: NextFunction) => {
	try {
		if(req.user) {
			const currentToken = req.cookies.access_token;
			const user = await User.findById(req.user.id);
			if(user){
				user.tokens = user.tokens.filter((token) => token.token !== currentToken);
				await user.save();
				
				res.clearCookie("access_token").status(200).json({message: "User successfully logged out."})
			}
		}else {
			throw createHttpError.Unauthorized("Please authenticate to view page");
		}
	}catch(error) {
		next(error);
	}
}

export const logoutFromAllDevice = async (req: IUserRequest, res: Response, next: NextFunction) => {
	try {
		if(req.user) {
			const user = await User.findById(req.user.id);
			if(user){
				user.tokens = [];
				await user.save();
				
				res.clearCookie("access_token").status(200).json({message: "User successfully logged out."})
			}
		}else {
			throw createHttpError.Unauthorized("Please Authenticate to view page.")
		}
	}catch(error) {
		next(error);
	}
}

export const updateUser = async (req: IUserRequest, res: Response, next: NextFunction) => {
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
				res.cookie("access_token", token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production"
				}).status(200).json({message: "User successfully updated.", user, token})
			}
		}else {
			throw createHttpError.Unauthorized("Please Authenticate.")
		}
	}catch(error) {
		next(error);
	}
}