/* eslint-disable react-hooks/exhaustive-deps */
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import { AppContext, AppContextType, UserStatus } from "@src/screens/Home";
import { Avatar } from "antd";
import { useContext, useEffect } from "react";
import ActiveIcon from "../ActiveIcon";

type FriendType = {
  imageUrl?: string;
  username: string;
  isActive: boolean;
};
function Friend({ imageUrl, username, isActive }: FriendType) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex-1 flex gap-3 items-center">
        <div className="relative">
          <Avatar size={40} icon={!imageUrl && <UserOutlined />} />
          <ActiveIcon isActive={isActive} />
        </div>

        <div>
          <h1 className="text-[16px]">{username}</h1>
        </div>
      </div>
      <UserAddOutlined className="cursor-pointer text-[25px] text-gray-400" />
    </div>
  );
}

export default function FindFriend() {
  const { potentialFriends, userStatus, setPotentialFriends } = useContext(
    AppContext
  ) as AppContextType;
  console.log(userStatus, "userStatus");
  console.log(potentialFriends, "poten");

  useEffect(() => {
    if (userStatus) {
      const updatedUser = potentialFriends.map((friend) => {
        userStatus.forEach((userStat: UserStatus) => {
          if (userStat.username === friend.username) {
            console.log(userStat, friend);
            console.log(userStat.isActive, friend.isActive);
            friend.isActive = userStat.isActive;
          }
        });
        return friend;
      });
      setPotentialFriends(updatedUser);
    }
  }, [setPotentialFriends, userStatus]);

  return (
    <div className="flex flex-col justify-between items-start gap-3">
      {potentialFriends.map((friend) => (
        <Friend key={friend._id} {...friend} />
      ))}
    </div>
  );
}
