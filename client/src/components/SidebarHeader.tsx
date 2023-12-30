import { AppContext, AppContextType } from "@src/screens/Home";
import { useContext } from "react";
import { homepageData } from "@src/utils/data";

export default function SidebarHeader() {
  const { currentMenu } = useContext(AppContext) as AppContextType;
  const currentMenuData = homepageData.find(
    (datum) => datum.label === currentMenu
  );
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-[20px] capitalize font-medium">{currentMenu}</h1>
      <div className="flex gap-5">
        {currentMenuData?.Icons &&
          currentMenuData?.Icons.map(({ Icon, label }) => (
            <Icon className="text-[20px] font-extralight" key={label} />
          ))}
      </div>
    </div>
  );
}
