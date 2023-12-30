import { useContext } from "react";
import SidebarHeader from "../SidebarHeader";
import { AppContext, AppContextType } from "@src/screens/Home";
import { homepageData } from "@src/utils/data";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ChatUI from "./ChatUI";

export default function Sidebar() {
  const { currentMenu } = useContext(AppContext) as AppContextType;
  const currentMenuData = homepageData.find(
    (datum) => datum.label === currentMenu
  );
  return (
    <div className="bg-gray-800 flex-1 p-3 px-5 rounded-tl-2xl text-gray-100">
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
