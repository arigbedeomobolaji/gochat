// import { Server, Socket } from "socket.io";
// import { authenticateUser, IUserRequest } from "./middlewares/authMiddleware";
// import { ObjectId } from "mongoose";
// import { Server as HttpServer } from "http";

// // Define user interface
// interface IUser extends Document {
//   _id: ObjectId;
//   username: string;
//   // isActive: boolean;
// }

// // Extend the Socket interface to include the user property
// interface CustomSocket extends Socket {
//   user?: IUser;
// }

// interface SocketRequest extends IUserRequest {
//   request: {
//     // res: Response;
//     user: any;
//   };
// }

// const activeUsers = new Map();

// export const configureSocketServer = (server: HttpServer) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:5173",
//     },
//   });

//   io.use(async (socket: CustomSocket, next) => {
//     try {
//       // Use the authenticateUser middleware to authenticate the user
//       await authenticateUser(
//         socket.request as SocketRequest,
//         socket.request.res as SocketRequest,
//         next
//       );
//       console.log("here now");
//       // If authentication is successful, associate user information with the Socket.IO connection
//       const user = socket.request.user;
//       console.log(user, "user");
//       if (user) {
//         activeUsers.set(socket.id, user);

//         // Emit the updated list of active users to all clients
//         io.emit("activeUsers", Array.from(activeUsers.values()));
//       } else {
//         // Handle case where authentication failed (optional)
//         next(new Error("Authentication failed."));
//       }
//     } catch (error: any) {
//       // Handle errors from the authentication middleware
//       next(error);
//     }
//   });

//   io.on("connection", (socket) => {
//     socket.on("disconnect", async () => {
//       // Remove the user from the activeUsers map when they disconnect
//       const user = activeUsers.get(socket.id);
//       if (user) {
//         user.active = false; // Set "active" to false on disconnect
//         await user.save();

//         activeUsers.delete(socket.id);
//         io.emit("activeUsers", Array.from(activeUsers.values()));
//       }
//     });

//     // ... (other Socket.IO event handlers)
//   });

//   return io;
// };
