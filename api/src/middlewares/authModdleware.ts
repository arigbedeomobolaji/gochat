import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
type Data = {
	id: string;
	email: string;
};

export interface IUserRequest extends Request {
	user?: Data;
}

const tokenSecret = process.env.TOKEN_SECRET as string;

export const authorization = async (
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
		req.user = data;
		next();
	} catch (error) {
		return res.status(403).send({ error: error });
	}
};
