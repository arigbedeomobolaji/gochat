import { useEffect, useState } from "react";
import useAuth from "./useAuth";

import { useCookies } from "react-cookie";
import { socketClient } from "@src/socket";
import { Socket } from "socket.io-client";
export default function useSocket() {
  const { user } = useAuth();
  const [cookies] = useCookies(["access_token"]);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = socketClient(user?.username, cookies?.access_token);
    if (socket) {
      setSocket(socket);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [cookies?.access_token, user, user?.username]);

  return {
    socket,
  };
}
