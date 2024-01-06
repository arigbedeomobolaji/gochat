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
import createHttpError from "http-errors";
import { IUserRequest } from "./middlewares/authMiddleware";
import { Document, ObjectId } from "mongoose";

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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Authentication middleware
io.use(async (socket: CustomSocket, next) => {
  const { username } = socket.handshake.query;

  if (!username) {
    return next(
      createHttpError.Unauthorized(
        "Authentication error: Username not provided."
      )
    );
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return next(
        createHttpError.Unauthorized("Authentication error: User not found.")
      );
    }

    // Attach the user object to the socket for later use
    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
});

// Socket.io event handling
io.on("connection", async (socket: CustomSocket) => {
  try {
    console.log(`${socket?.user?.username} connected`);

    // Update user's isActive status in the database
    const activeUser = await User.findByIdAndUpdate(
      socket?.user?._id,
      { isActive: true },
      { new: true }
    );

    if (activeUser) {
      console.log(`${activeUser.username} is now active`);
      // Emit 'userStatus' event to all connected clients
      io.emit("userStatus", { username: activeUser?.username, isActive: true });
    }

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log(`${socket?.user?.username} disconnected`);

      // Update user's isActive status in the database on disconnect
      const unActiveUser = await User.findByIdAndUpdate(
        socket?.user?._id,
        { isActive: false },
        { new: true }
      );

      if (unActiveUser) {
        console.log(`${unActiveUser.username} is now inactive`);
        // Emit 'userStatus' event to all connected clients
        io.emit("userStatus", {
          username: unActiveUser?.username,
          isActive: false,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

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
