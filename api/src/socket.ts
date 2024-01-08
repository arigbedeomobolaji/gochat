import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import { ObjectId } from "mongoose";
import { validateUser } from "./utils/validateUser";
import { User, UserDocument } from "./models/user.model";
import { friends, notFriends } from "./controllers/socket.controller";
dotenv.config();

// Define user interface
interface IUser extends UserDocument {
  _id: ObjectId;
  username: string;
  // isActive: boolean;
}

// Extend the Socket interface to include the user property
interface CustomSocket extends Socket {
  user?: IUser;
  token?: string;
}

export const configureSocketServer = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_HOME_PAGE_URL,
    },
    pingTimeout: 60000,
    maxHttpBufferSize: 1e8,
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    },
  });

  io.use(async (socket: CustomSocket, next) => {
    const token = socket.handshake.query.token as string;
    const user = await validateUser(token);
    if (user) {
      socket.user = user;
      return next();
    }
    // If not authenticated, reject the connection
    return next(new Error("Authentication failed"));
  });

  // Socket.io event handling
  io.on("connection", async (socket: CustomSocket) => {
    try {
      console.log(`${socket?.user?.username} connected`);

      // Find friends event
      socket.on("findPotentialFriends", async (user) => {
        const friends = await notFriends(user);
        if (friends) {
          socket.emit("foundPotentialFriends", friends);
        }
      });

      // your friends event
      socket.on("findFriends", async (user) => {
        const myFriends = await friends(user);
        if (myFriends) {
          socket.emit("foundFriends", myFriends);
        }
      });

      // Handle disconnection
      socket.on("disconnect", async (reason) => {
        console.log(`${socket?.user?.username} disconnected`);
        console.log(reason);
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
};
