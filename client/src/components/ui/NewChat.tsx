import {
  SearchOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Input, Avatar } from "antd";
import NewModal from "./NewModal";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext, AppContextType } from "@src/screens/Home";
import { User } from "@src/types";
import ActiveIcon from "../ActiveIcon";

type NewChatType = {
  open: boolean;
  setOpen: (state: boolean) => void;
};

// type Friend = {
//   username: string;
//   id: string;
//   location: {
//     country: string;
//     city: string;
//   };
// };

export default function NewChat({ open, setOpen }: NewChatType) {
  const { friends } = useContext(AppContext) as AppContextType;
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);

  const savedUsers = useMemo(() => friends, [friends]);

  useEffect(() => {
    if (friends) {
      setFilteredFriends(friends);
    }
  }, [friends]);

  function handleSearch(ev: React.ChangeEvent<HTMLInputElement>) {
    const filteredUser = savedUsers.filter((user: User) =>
      user.username.includes(ev.target.value)
    );
    setFilteredFriends(filteredUser);
  }

  return (
    <NewModal open={open} setOpen={setOpen}>
      <div className="p-3 bg-gray-700 rounded-md">
        <h1 className="text-lg">New Chat</h1>
        <div className="mt-4">
          <Input
            size="large"
            placeholder="search with name"
            prefix={<SearchOutlined />}
            className="font-lato hover:!border-gray-300 focus:!border-gray-300 "
            onChange={handleSearch}
          />
        </div>
        <div className="flex justify-start items-center gap-3 py-5">
          <Avatar size={32} icon={<UsergroupAddOutlined />} />
          <h3 className="font-medium">New Group</h3>
        </div>
        <h3 className="font-semibold">Friends</h3>
        <div className="flex items-start flex-col justify-center py-3  space-y-2 capitalize">
          {filteredFriends.length ? (
            filteredFriends?.map((friend: User) => (
              <div
                className="flex gap-3 items-center justify-start w-full cursor-pointer"
                key={friend.username}
              >
                <div className="relative">
                  <Avatar size={32} icon={<UserOutlined />} />
                  <ActiveIcon isActive={friend.isActive} />
                </div>

                <p>{friend.username}</p>
              </div>
            ))
          ) : (
            <p>No User</p>
          )}
        </div>
      </div>
    </NewModal>
  );
}
