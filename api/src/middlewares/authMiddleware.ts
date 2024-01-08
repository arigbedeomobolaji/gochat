import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, UserInput } from "../models/user.model";
import passport from "passport";
import "../controllers/oath.controller";
import createHttpError from "http-errors";
import { ObjectId } from "mongoose";
dotenv.config();
export interface UserData extends UserInput {
  _id: string;
  friends: string[];
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
      const userInDatabase = await User.findOne({
        _id: data._id,
        "tokens.token": token,
      });

      if (userInDatabase) {
        req.user = userInDatabase as unknown as UserData;

        if (userInDatabase.isActive) {
          next();
          return;
        }

        // set isActive filed during login process
        userInDatabase.isActive = true;
        await userInDatabase.save();
        next();
      }
    } catch (error: any) {
      const tokenToDelete = req.cookies.access_token;
      if (tokenToDelete) {
        const data = (await jwt.verify(tokenToDelete, tokenSecret, {
          ignoreExpiration: true,
        })) as UserData;
        const user = await User.findById(data._id);
        const tokenId = user?.tokens.findIndex(
          (token) => token.token === tokenToDelete
        ) as number;
        if (user && tokenId > -1) {
          user.tokens.splice(tokenId, 1);
          res.clearCookie("access_token");
          await user.save();
          next(createHttpError.Unauthorized("Please Authenticate."));
        }
      } else {
        next(createHttpError.Unauthorized("Please Authenticate."));
      }
    }
  });
