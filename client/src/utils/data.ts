import {
  IoChatbubblesOutline,
  IoStarOutline,
  IoArchiveOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import { TbPhoneCalling, TbPhonePlus } from "react-icons/tb";
import { LuCircleDashed } from "react-icons/lu";

export const data = {
  topIcons: [
    {
      Icon: IoChatbubblesOutline,
      label: "chat",
      Icons: [
        {
          Icon: FaEdit,
          label: "edit",
        },
        {
          Icon: MdFilterList,
          label: "filter",
        },
      ],
    },
    {
      Icon: TbPhoneCalling,
      label: "phone",
    },
    {
      Icon: LuCircleDashed,
      label: "status",
    },
  ],
  bottomIcons: [
    {
      Icon: IoArchiveOutline,
      label: "archive",
    },
    {
      Icon: IoStarOutline,
      label: "starred messages",
    },
    {
      Icon: IoSettingsOutline,
      label: "settings",
    },
  ],
};

type IconType = {
  Icon: React.FC<React.SVGProps<SVGElement>>;
  label: string;
};

type HomepageData = {
  Icon: React.FC<React.SVGProps<SVGElement>>;
  label: string;
  Icons?: IconType[];
  searchText?: string;
};

export const homepageData: HomepageData[] = [
  {
    Icon: IoChatbubblesOutline,
    label: "chat",
    Icons: [
      {
        Icon: FaEdit,
        label: "edit",
      },
      {
        Icon: MdFilterList,
        label: "filter",
      },
    ],
    searchText: "Search or start a new chat",
  },
  {
    Icon: TbPhoneCalling,
    label: "phone",
    Icons: [{ Icon: TbPhonePlus, label: "phone" }],
    searchText: "Search or start a new call",
  },
  {
    Icon: LuCircleDashed,
    label: "status",
  },
  {
    Icon: IoArchiveOutline,
    label: "archive",
    searchText: "Search archived chats",
  },
  {
    Icon: IoStarOutline,
    label: "starred messages",
    searchText: "Search",
  },
  {
    Icon: IoSettingsOutline,
    label: "settings",
  },
];
