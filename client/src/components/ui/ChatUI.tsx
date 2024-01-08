import { useContext } from "react";
import Chat from "./Chat";
import { AppContext, AppContextType } from "@src/screens/Home";
import FindFriend from "./FindFriend";

function ChatUI() {
  const { currentMenu } = useContext(AppContext) as AppContextType;
  return (
    <>
      {currentMenu === "chat" ? (
        <Chat />
      ) : currentMenu === "find friends" ? (
        <FindFriend />
      ) : (
        "Chat and Friends UI"
      )}
    </>
  );
}

export default ChatUI;
