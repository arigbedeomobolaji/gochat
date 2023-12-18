import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, UserInput } from "../models/user.model";
import passport from "passport";
import "../controllers/oath.controller"
dotenv.config();
export interface UserData extends UserInput {
	id: string;
};

export interface IUserRequest extends Request {
	user?: any;
}

const tokenSecret = process.env.TOKEN_SECRET as string;

export const authenticateUser =  (passport.authenticate('google'), async (req: IUserRequest, res: Response, next: NextFunction) => {
	try {
		
		if(req.user) {
			req.user = req.user;
			console.log(req.user, "AuthMiddlerware")
			return next();	
		}
		const token = req.cookies.access_token;
		console.log(token)
		if (!token) {
			return res.status(403).json({ error: "Please Authenticate" });
		}
		const data = (await jwt.verify(token, tokenSecret)) as UserData;
		if(data) {
			req.user = data as UserData;
			next();
		}
	} catch (error: any) {
		if(error.name === "TokenExpiredError") {
			const expiredToken = req.cookies.access_token;
			const data = await jwt.verify(expiredToken, tokenSecret, {ignoreExpiration:true}) as UserData;
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
});
