import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { connectToDatabase } from "./utils/mongoose";
import userRouter from "./routes/user.router";
import oauthRouter from "./routes/oauth.router";
import cookieParser from "cookie-parser";
import passport from "passport";
import { errorHandler } from "./middlewares/errorMiddleware";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { User } from "./models/user.model";
// import createHttpError from "http-errors";
// import { IUserRequest } from "./middlewares/authMiddleware";
import { Document, ObjectId } from "mongoose";
import { configureSocketServer } from "./socket";

dotenv.config();

// Define user interface
interface IUser extends Document {
  _id: ObjectId;
  username: string;
  // isActive: boolean;
}

// Extend the Socket interface to include the user property
interface CustomSocket extends Socket {
  user?: IUser;
}

const sessionSecret = process.env.SESSION_SECRET || "";

const app: Express = express();
const server = createServer(app);
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));

const port = process.env.PORT || "4400";
const mongoUrl = process.env.MONGODB_URL as string;

// db connection
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: "Express + TypeScript Server" });
  } catch (error: any) {
    next(error);
  }
});

app.use("/api/users", userRouter);
app.use("/api/auth", oauthRouter);

// Socket codes
const io = configureSocketServer(server);

// Error Middleware
app.use(errorHandler);

const start = (portToUse: string) => {
  try {
    server.listen(portToUse, () => {
      console.log(
        `🚀🚀🚀 Api up and running at: http://localhost:${portToUse}`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit();
  }
};

(async () => await connectToDatabase(mongoUrl))();
start(port);
