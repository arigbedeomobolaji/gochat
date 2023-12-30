import {
  SearchOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Input, Avatar } from "antd";
import NewModal from "./NewModal";
import { useQuery } from "@tanstack/react-query";
import { getOtherUsers } from "@src/queries/user.queries";
import { errorFormat } from "@src/utils/errorFormat";
import { useEffect, useMemo, useState } from "react";

type NewChatType = {
  open: boolean;
  setOpen: (state: boolean) => void;
};

type Friend = {
  username: string;
  id: string;
  location: {
    country: string;
    city: string;
  };
};

export default function NewChat({ open, setOpen }: NewChatType) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["friends"],
    queryFn: getOtherUsers,
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const [otherUsers, setOtherUsers] = useState<Friend[]>([]);

  const savedUsers = useMemo(() => data?.data, [data?.data]);

  if (isError) {
    alert(errorFormat(error));
  }

  useEffect(() => {
    console.log(data?.data);
    if (data?.data) {
      setOtherUsers(data.data);
    }
  }, [data?.data]);

  console.log("This component is reredn");

  function handleSearch(ev: React.ChangeEvent<HTMLInputElement>) {
    const filteredUser = savedUsers.filter((user: Friend) =>
      user.username.includes(ev.target.value)
    );
    setOtherUsers(filteredUser);
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

        {isPending ? (
          <code>Loading your friends</code>
        ) : (
          <div className="flex items-start flex-col justify-center py-3  space-y-2 capitalize">
            {otherUsers.length ? (
              otherUsers?.map((friend: Friend) => (
                <div
                  className="flex gap-3 items-center justify-start w-full hover:bg-gray-500 cursor-pointer"
                  key={friend.username}
                >
                  <Avatar size={32} icon={<UserOutlined />} />
                  <p>{friend.username}</p>
                </div>
              ))
            ) : (
              <p>No User</p>
            )}
          </div>
        )}
      </div>
    </NewModal>
  );
}
