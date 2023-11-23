import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./utils/mongoose";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const mongoUrl = process.env.MONGODB_URL as string;
// db connection
(async () => await connectToDatabase(mongoUrl))();

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Express + TypeScript Server" });
});

app.listen(port, () => {
	console.log(`✔️ [server]: Server is running at http://localhost:${port}`);
});
