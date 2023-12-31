/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState } from "react";
import { data } from "@src/utils/data";
import { AppContext, AppContextType } from "@src/screens/Home";
import { Button, Tooltip } from "antd";

interface IconType {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
}

export default function MiniBar() {
  const { currentMenu, setCurrentMenu, setSidebarOpen } = useContext(
    AppContext
  ) as AppContextType;

  function MyIcon({ Icon, label }: IconType) {
    const [isActive] = useState(label === currentMenu);
    function handleIconClick() {
      setCurrentMenu(label);
      setSidebarOpen(true);
    }
    return (
      <>
        <Tooltip placement="rightTop" title={label}>
          <Icon
            className={`${
              isActive &&
              "border-solid border-transparent border-l-2 border-l-purple-500 bg-gray-900 text-[28px]"
            } text-[20px] px-1 pl-2 w-full rounded-5`}
            onClick={handleIconClick}
          />
        </Tooltip>
      </>
    );
  }
  return (
    <div
      className={`bg-black ${
        currentMenu ? "flex flex-col" : "hidden"
      } flex flex-col justify-between items-center text-gray-200 p-2 py-3 z-20`}
    >
      {/* Top Icons */}
      <div className="flex flex-col items-start w-full gap-5">
        {data.topIcons.map(({ Icon, label }) => (
          <MyIcon Icon={Icon} label={label} key={label} />
        ))}
      </div>
      {/* Bottom Icons */}
      <div className="flex flex-col items-start w-full gap-5">
        {data.bottomIcons.map(({ Icon, label }) => (
          <MyIcon Icon={Icon} label={label} key={label} />
        ))}
      </div>
    </div>
  );
}
