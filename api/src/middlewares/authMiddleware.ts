import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, UserDocument } from "../models/user.model";
dotenv.config();
export type Data = {
	id: string;
	email: string;
	name: string;
	location: {
		country: string;
		city: string;
	}
};

export interface IUserRequest extends Request {
	user?: Data;
}

const tokenSecret = process.env.TOKEN_SECRET as string;

export const authenticateUser = async (
	req: IUserRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies.access_token;
	if (!token) {
		return res.status(403).json({ error: "Please Authenticate" });
	}
	try {
		const data = (await jwt.verify(token, tokenSecret)) as Data;
		if(data) {
			req.user = data;
		next();
		}
		
	} catch (error: any) {
		if(error.name === "TokenExpiredError") {
			const expiredToken = req.cookies.access_token;
			const data = await jwt.verify(expiredToken, tokenSecret, {ignoreExpiration:true}) as Data;
			const user = await User.findById(data.id);
			const tokenId = user?.tokens.findIndex((token) => token.token === expiredToken) as number;
			
			if(user && tokenId > -1) {
				console.log({tokes: user.tokens.length})
				user.tokens.splice(tokenId,1);
				console.log({tokes: user.tokens.length})
				res.clearCookie('access_token');
				await user.save();
				return res.status(401).json({error: "Please authenticate. token has been deleted because it has expired."})
			}
		}
		return res.status(403).send({ error: error });
	}
};