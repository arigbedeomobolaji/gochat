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
import { Dispatch, SetStateAction, createContext, useState } from "react";
export interface AppContextType {
  currentMenu: string;
  setCurrentMenu: Dispatch<SetStateAction<string>>;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}
export const AppContext = createContext<AppContextType | undefined>(undefined);

export default function Home() {
  const [currentMenu, setCurrentMenu] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  if (loading) {
    return <h1>Fetching User data</h1>;
  }

  function handleLogout(path: string) {
    console.log(path);
    mutation.mutate(path);
  }

  const appContextValue: AppContextType = {
    currentMenu,
    setCurrentMenu,
    sidebarOpen,
    setSidebarOpen,
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
