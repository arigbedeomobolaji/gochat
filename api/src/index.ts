import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectToDatabase } from "./utils/mongoose";
import userRouter from "./routes/user.router";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

const port = process.env.PORT || "4400";
const mongoUrl = process.env.MONGODB_URL as string;
// db connection
(async () => await connectToDatabase(mongoUrl))();

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Express + TypeScript Server" });
});

app.use("/api/users", userRouter);

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
