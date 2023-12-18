import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import { connectToDatabase } from "./utils/mongoose";
import userRouter from "./routes/user.router";
import oauthRouter from "./routes/oauth.router";
import cookieParser from "cookie-parser";
import passport from "passport";

dotenv.config();

const sessionSecret = process.env.SESSION_SECRET || "";

const app: Express = express();
app.use(express.json());
app.use(session({
	secret: sessionSecret,
	resave: true,
	saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));

const port = process.env.PORT || "4400";
const mongoUrl = process.env.MONGODB_URL as string;
// db connection
(async () => await connectToDatabase(mongoUrl))();

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Express + TypeScript Server" });
});

app.use("/api/users", userRouter);
app.use("/api/auth", oauthRouter);

const start = (portToUse: string) => {
	try {
		app.listen(portToUse, () => {
			console.log(`Api up and running at: http://localhost:${portToUse}`);
		});
	} catch (error) {
		console.error(error);
		process.exit();
	}
};
start(port);
