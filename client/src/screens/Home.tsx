/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate } from "react-router-dom";
import useAuth from "@src/hooks/useAuth";
import { logoutUser } from "@src/queries/user.mutation";
import { errorFormat } from "@src/utils/errorFormat";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { removeUser } from "@src/localStorage/userLocalStorage";
import MiniBar from "@src/components/ui/MiniBar";
import Sidebar from "@src/components/ui/Sidebar";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { Spin } from "antd";
import { User } from "@src/types";
import useSocket from "@src/hooks/useSocket";
export type UserStatus = {
  username: string;
  isActive: boolean;
};
export interface AppContextType {
  currentMenu: string;
  setCurrentMenu: Dispatch<SetStateAction<string>>;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  potentialFriends: User[];
  setPotentialFriends: Dispatch<SetStateAction<User[]>>;
  friends: User[];
  setFriends: Dispatch<SetStateAction<User[]>>;
  userStatus: Set<UserStatus>;
  setUserStatus: Dispatch<SetStateAction<Set<UserStatus>>>;
}
export const AppContext = createContext<AppContextType | undefined>(undefined);

export default function Home() {
  const [currentMenu, setCurrentMenu] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [potentialFriends, setPotentialFriends] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [userStatus, setUserStatus] = useState<Set<UserStatus>>(new Set());
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess() {
      console.log("successfully");
      removeUser();
      navigate("/auth");
    },
    onError(error) {
      setTimeout(() => {
        toast.error(errorFormat(error), {
          position: "top-right",
          theme: "colored",
        });
      }, 0);
    },
  });

  const { loading, user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      // Potential friends
      socket.emit("findPotentialFriends", user);
      socket.on("foundPotentialFriends", (potentialFriends: User[]) => {
        setPotentialFriends((prevFriends) => [
          ...prevFriends,
          ...potentialFriends,
        ]);
      });
      // Your friends
      socket.emit("findFriends", user);
      socket.on("foundFriends", (yourFriends: User[]) => {
        if (yourFriends.length) {
          setFriends((prevFriends) => [...prevFriends, ...yourFriends]);
        }
      });

      // Check userStatus
      socket.on("userStatus", (data) => {
        if (data) {
          setUserStatus((prevStatuses) => {
            const prevSet = new Set(prevStatuses);
            prevSet.forEach((set) => {
              if (set.username === data.username) {
                prevSet.delete(set);
              }
            });
            return new Set([...prevSet, data]);
          });
        }
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, user, user?.username]);

  if (loading) {
    return <Spin spinning={true} fullscreen />;
  }

  // function handleLogout(path: string) {
  //   console.log(path);
  //   mutation.mutate(path);
  // }

  const appContextValue: AppContextType = {
    currentMenu,
    setCurrentMenu,
    sidebarOpen,
    setSidebarOpen,
    potentialFriends,
    setPotentialFriends,
    friends,
    setFriends,
    userStatus,
    setUserStatus,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="flex xl:grid xl:grid-cols-12 h-screen bg-black font-lato">
        <div className="flex xl:col-span-3">
          <MiniBar />
          <Sidebar />
        </div>

        <div
          className="flex-1 xl:col-span-9 bg-gray-700 flex items-center justify-center"
          onClick={() => setSidebarOpen(false)}
        >
          <h1 className="text-white font-bold">Chat Console</h1>
        </div>
      </div>
    </AppContext.Provider>
  );
}
