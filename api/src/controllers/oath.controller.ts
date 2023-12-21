import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import dotenv from "dotenv";
import { User } from "../models/user.model";
dotenv.config();

const googleCLientId = process.env.GOOGLE_OAUTH_CLIENT_ID || ""
const googleClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || "";
const callbackUri = process.env.CALLBACK_URI || "";


// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
	done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser<any, any>(async (obj, done) => {
	done(null, obj)
	
});

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
		const token = await user.generateAuthToken();
		const data = {
			user,
			token
		}
		if(data){
			return done(null, data);
		}	
	}
	)
);
