import { useContext } from "react";
import SidebarHeader from "../SidebarHeader";
import { AppContext, AppContextType } from "@src/screens/Home";
import { homepageData } from "@src/utils/data";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ChatUI from "./ChatUI";

export default function Sidebar() {
  const { currentMenu, sidebarOpen } = useContext(AppContext) as AppContextType;
  const currentMenuData = homepageData.find(
    (datum) => datum.label === currentMenu
  );
  return (
    <div
      className={`bg-gray-800 p-3 px-5 pt-5 ${
        sidebarOpen
          ? "block min-w-[250px] absolute top-0 bottom-0 left-10 md:left-14 p-10"
          : "hidden"
      }  xl:flex flex-col flex-1 flex-grow rounded-tl-2xl text-gray-100`}
    >
      <SidebarHeader />
      {currentMenuData?.searchText && (
        <div className="mt-4">
          <Input
            size="large"
            placeholder={currentMenuData?.searchText}
            prefix={<SearchOutlined />}
            className="font-lato hover:!border-gray-300"
          />
        </div>
      )}
      <div className="mt-5">
        {currentMenu === "chat" ? <ChatUI /> : <div>Coming soon...</div>}
      </div>
    </div>
  );
}
