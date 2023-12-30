import React from "react";
import { Modal, ConfigProvider } from "antd";

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
  children: React.ReactNode;
};
const NewModal: React.FC<NewModalType> = ({ open, setOpen, children }) => {
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
          className="text-gray-50 absolute top-12  md:left-20 font-lato"
        >
          {children}
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default NewModal;
