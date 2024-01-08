import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import { AppContext, AppContextType } from "@src/screens/Home";
import { Avatar } from "antd";
import { useContext } from "react";

type FriendType = {
  imageUrl?: string;
  username: string;
};
function Friend({ imageUrl, username }: FriendType) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex-1 flex gap-3 items-center">
        <Avatar size={40} icon={!imageUrl && <UserOutlined />} />
        <div>
          <h1 className="text-[16px]">{username}</h1>
        </div>
      </div>
      <UserAddOutlined className="cursor-pointer" />
    </div>
  );
}

export default function FindFriend() {
  const { potentialFriends } = useContext(AppContext) as AppContextType;

  return (
    <div className="flex flex-col justify-between items-start gap-3">
      {potentialFriends.map((friend) => (
        <Friend key={friend._id} username={friend.username} />
      ))}
    </div>
  );
}
