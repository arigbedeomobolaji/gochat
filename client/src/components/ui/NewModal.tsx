import React, { useState } from "react";
import { Button, Modal, ConfigProvider } from "antd";

const modalStyles = {
  body: {},
  mask: {},
  footer: {},
  content: {
    padding: 0,
  },
};

const NewModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Modal of 1000px width
      </Button>
      <ConfigProvider
        modal={{
          //   classNames,
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
          className="text-gray-50 absolute"
        >
          <div className="p-3 bg-gray-700 rounded-md">
            <h1 className="text-lg">New Chat</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat,
              nulla, reprehenderit aspernatur labore at molestiae numquam, nihil
              rem a fuga maiores! Molestiae, harum? Ab cumque id culpa hic
              consequatur, nobis facilis quam? Soluta, sint officia? Deserunt
              neque eveniet temporibus molestias.
            </p>
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default NewModal;
