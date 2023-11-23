import { Button } from "antd";

type BlockButtonType = {
	color?: string;
	disabled?: boolean;
	children: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLElement>;
};

function BlockButton({
	color,
	children,
	disabled = false,
	onClick,
}: BlockButtonType): React.ReactElement {
	return (
		<Button
			onClick={onClick}
			block
			disabled={disabled}
			className={`btn-block ${
				color === "black"
					? "bg-black text-white border-gray-500 hover:border-blac hover:text-gray-300"
					: "bg-white text-black border-gray-100 hover:border-gray-300 hover:text-gray-700"
			} ${disabled && "opacity-50"}`}
		>
			{children}
		</Button>
	);
}

export default BlockButton;
