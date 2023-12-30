import React from "react";
import { Modal, ConfigProvider, Input, Avatar } from "antd";
import { SearchOutlined, UsergroupAddOutlined } from "@ant-design/icons";

const modalStyles = {
  body: {},
  mask: {},
  footer: {},
  content: {
    padding: 0,
  },
};

type NewModalType = {
  open: boolean;
  setOpen: (state: boolean) => void;
};
const NewModal: React.FC<NewModalType> = ({ open, setOpen }) => {
  return (
    <>
      <ConfigProvider
        modal={{
          styles: modalStyles,
        }}
      >
        <Modal
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={300}
          footer={null}
          closeIcon={false}
          mask={false}
          className="text-gray-50 absolute top-12 left-40 font-lato"
        >
          <div className="p-3 bg-gray-700 rounded-md">
            <h1 className="text-lg">New Chat</h1>
            <div className="mt-4">
              <Input
                size="large"
                placeholder="search with name"
                prefix={<SearchOutlined />}
                className="font-lato hover:!border-gray-300 focus:!border-gray-300 "
              />
            </div>
            <div className="flex justify-start items-center gap-3 py-5">
              <Avatar size={32} icon={<UsergroupAddOutlined />} />
              <h3 className="font-medium">New Group</h3>
            </div>
            <p>Friends</p>
            <div>
              <code>Your friends come here</code>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default NewModal;
