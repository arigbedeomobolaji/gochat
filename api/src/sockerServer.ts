import { Request } from "express";
import { Server, Socket } from "socket.io";
import { authenticateUser, IUserRequest } from "./middlewares/authMiddleware";
import { User, UserInput } from "./models/user.model";
import createHttpError from "http-errors";
import { ObjectId } from "mongoose";
import { Server as HttpServer, IncomingMessage } from "http";
import { ExtendedError } from "socket.io/dist/namespace";

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

interface SocketRequest extends Request {
  request: {
    // res: Response;
    user: any;
  };
}

const activeUsers = new Map();

export const configureSocketServer = (server: HttpServer) => {
  const io = new Server(server);

  io.use(async (socket: CustomSocket, next) => {
    try {
      // Use the authenticateUser middleware to authenticate the user
      await authenticateUser(
        socket.request as SocketRequest,
        socket.request.res as SocketRequest,
        next
      );

      // If authentication is successful, associate user information with the Socket.IO connection
      const user = socket.request.user as any;
      if (user) {
        activeUsers.set(socket.id, user);

        // Emit the updated list of active users to all clients
        io.emit("activeUsers", Array.from(activeUsers.values()));
      } else {
        // Handle case where authentication failed (optional)
        next(new Error("Authentication failed."));
      }
    } catch (error: any) {
      // Handle errors from the authentication middleware
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", async () => {
      // Remove the user from the activeUsers map when they disconnect
      const user = activeUsers.get(socket.id);
      if (user) {
        user.active = false; // Set "active" to false on disconnect
        await user.save();

        activeUsers.delete(socket.id);
        io.emit("activeUsers", Array.from(activeUsers.values()));
      }
    });

    // ... (other Socket.IO event handlers)
  });

  return io;
};
