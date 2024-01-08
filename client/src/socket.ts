import { io } from "socket.io-client";

export const socketClient = (username?: string, token?: string) => {
  if (username && token) {
    const socket = io(import.meta.env.VITE_SOCKET_API_URL, {
      query: { username, token },
      reconnection: true,
      reconnectionAttempts: 3, // Adjust as needed
      reconnectionDelay: 1000, // Adjust as needed
    });
    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      // Handle the disconnection reason accordingly
    });
    return socket;
  }
};
