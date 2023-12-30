import { AppContext, AppContextType } from "@src/screens/Home";
import { useContext, useState } from "react";
import { homepageData } from "@src/utils/data";
import NewChat from "./ui/NewChat";

export default function SidebarHeader() {
  const [open, setOpen] = useState(false);

  const { currentMenu } = useContext(AppContext) as AppContextType;
  const currentMenuData = homepageData.find(
    (datum) => datum.label === currentMenu
  );
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-[20px] capitalize font-medium">{currentMenu}</h1>
      <div className="flex gap-5">
        {currentMenuData?.Icons &&
          currentMenuData?.Icons.map(({ Icon, label }, index) => (
            <div key={label + index} className="relative">
              <Icon
                className="text-[20px] font-extralight cursor-pointer"
                onClick={() => label === "edit" && setOpen((prev) => !prev)}
              />
              <NewChat open={open} setOpen={setOpen} />
            </div>
          ))}
      </div>
    </div>
  );
}
