import express from "express";
import passport from "passport";
import "../controllers/oath.controller";
import { authenticateUser } from "../middlewares/authMiddleware";
const oauthRouter = express.Router();

oauthRouter.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}))
oauthRouter.get("/google/callback",passport.authenticate('google'), (req,res) => {
    res.redirect("/api/users");
});

oauthRouter.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if(err) {return next(err)}
        res.redirect("/");
    })
})

export default oauthRouter