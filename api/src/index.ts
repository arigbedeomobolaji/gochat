import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { connectToDatabase } from "./utils/mongoose";
import cookieSession from "cookie-session";
import userRouter from "./routes/user.router";
import oauthRouter from "./routes/oauth.router";
import cookieParser from "cookie-parser";
import passport from "passport";
import {errorHandler}  from "./middlewares/errorMiddleware";

dotenv.config();

const sessionSecret = process.env.SESSION_SECRET || "";

const app: Express = express();
app.use(
	cors({
	  origin: ["http://localhost:5173"],
	  methods: ["GET", "POST", "PUT", "DELETE"],
	  credentials: true,
	})
  );
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
app.get("/", (req: Request, res: Response, next: NextFunction) => {
	try {
		
		res.json({ message: "Express + TypeScript Server" });
	} catch (error:any) {
		next(error)
	}
	
});

app.use("/api/users", userRouter);
app.use("/api/auth", oauthRouter);
// Error Middleware
app.use(errorHandler);


const start = (portToUse: string) => {
	try {
		app.listen(portToUse, () => {
			console.log(`🚀🚀🚀 Api up and running at: http://localhost:${portToUse}`);
		});
	} catch (error) {
		console.error(error);
		process.exit();
	}
};

(async () => await connectToDatabase(mongoUrl))();
start(port);
