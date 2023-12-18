import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import { Response, Request } from "express"
import dotenv from "dotenv";
import { User } from "../models/user.model";
dotenv.config();


const googleCLientId = process.env.GOOGLE_OAUTH_CLIENT_ID || ""
const googleClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || "";
const callbackUri = process.env.CALLBACK_URI || "";

console.log(callbackUri)

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser<any, any>((obj: any, done) => {
	done(null, obj)
})

passport.use(
	new GoogleStrategy({
		clientID: googleCLientId,
		clientSecret: googleClientSecret,
		callbackURL: callbackUri
	}, 
	async (accessToken, refreshToken, profile, done) => {
		const name = profile._json.name || "";
		const email = profile._json.email || "";
		const username = email?.split("@")[0];
		const user = await User.findOrCreate(name, email, username);
		const id = user._id.toString();
		delete user._id;
		
		if(user){
			return done(null, {...user, id});
		}
		
	}
	)
);
