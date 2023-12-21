import express from "express";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import "../controllers/oath.controller";
import { expiresIn } from "../utils";
import { UserData } from "../middlewares/authMiddleware";

const CLIENT_HOME_PAGE_URL = process.env.CLIENT_HOME_PAGE_URL || "";

const oauthRouter = express.Router();


// when login is successful, retrieve user info
oauthRouter.get("/login/success", (req,res) => {
    if(req.user) {
        res.json({
            success: true,
            message: "user has successfully autHenticated",
            user: req.user,
            cookies: req.cookies
        })
    }
});

// when login failed, send failed msg
oauthRouter.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "user failed to authenticate."
    });
});

// auth with google
oauthRouter.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}))

// redirect to home page after successfully login via google
oauthRouter.get("/google/redirect",passport.authenticate('google'), (req,res) => {
    // console.log(req.user);
    // res.redirect(CLIENT_HOME_PAGE_URL)
    const {token, user} = req.user as {token: string, user: UserData}
    res.status(200).cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + expiresIn)
    }).redirect(CLIENT_HOME_PAGE_URL+"?userId="+ user?._id);
});

export default oauthRouter