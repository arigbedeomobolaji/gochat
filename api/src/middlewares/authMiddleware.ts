import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, UserInput } from "../models/user.model";
import passport from "passport";
import "../controllers/oath.controller";
import createHttpError from "http-errors";
dotenv.config();
export interface UserData extends UserInput {
  _id: string;
  id: string;
}

export interface IUserRequest extends Request {
  user?: any;
}

const tokenSecret = process.env.TOKEN_SECRET as string;

export const authenticateUser =
  (passport.authenticate("google"),
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.access_token;
      if (!token) {
        return next(createHttpError.NotFound("Please authenticate."));
      }
      const data = (await jwt.verify(token, tokenSecret)) as UserData;
      const userInDatabase = await User.findById(data.id);

      if (userInDatabase) {
        req.user = userInDatabase as unknown as UserData;
        next();
      }
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        const expiredToken = req.cookies.access_token;
        const data = (await jwt.verify(expiredToken, tokenSecret, {
          ignoreExpiration: true,
        })) as UserData;
        const user = await User.findById(data.id);
        const tokenId = user?.tokens.findIndex(
          (token) => token.token === expiredToken
        ) as number;

        if (user && tokenId > -1) {
          user.tokens.splice(tokenId, 1);
          res.clearCookie("access_token");
          await user.save();
          throw next(createHttpError.Unauthorized("Please authenticate."));
        }
      }
      next(createHttpError.Unauthorized("Please Authenticate."));
    }
  });
