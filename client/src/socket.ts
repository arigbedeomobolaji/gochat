import { io } from "socket.io-client";

export const socketClient = (username?: string, token?: string) => {
  if (username && token) {
    const socket = io(import.meta.env.VITE_SOCKET_API_URL, {
      query: { username, token },
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });
    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });
    return socket;
  }
};
