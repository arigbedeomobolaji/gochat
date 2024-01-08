import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

export default function Chat() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex-1 flex gap-3 items-center">
        <Avatar size={40} icon={<UserOutlined />} />
        <div>
          <h1 className="text-[16px]">Name</h1>
          <p>last message</p>
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-[14px]">Time</h3>
        <p className="text-xs">status</p>
      </div>
    </div>
  );
}
