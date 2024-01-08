import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { UserData } from "../middlewares/authMiddleware";
import { User } from "../models/user.model";
dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET as string;

export const validateUser = async (token: string) => {
  if (token) {
    const data = (await jwt.verify(token, tokenSecret)) as UserData;
    const userInDatabase = await User.findById(data._id);

    if (userInDatabase) {
      // set isActive filed during login process
      if (userInDatabase.isActive) {
        return userInDatabase;
      }

      userInDatabase.isActive = true;
      await userInDatabase.save();
      return userInDatabase;
    }
  }
};
