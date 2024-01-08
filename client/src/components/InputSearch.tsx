import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

interface InputSearchType {
  placeholder: string;
  prefixIcon: boolean;
}

export default function InputSearch({
  placeholder,
  prefixIcon,
}: InputSearchType) {
  return (
    <div className="mt-4">
      <Input
        size="large"
        placeholder={placeholder}
        prefix={prefixIcon && <SearchOutlined />}
        className="font-lato hover:!border-gray-300"
      />
    </div>
  );
}
