import { Button } from "antd";

type BlockButtonType = {
	color?: string;
	children: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLElement>;
};

function BlockButton({
	color,
	children,
	onClick,
}: BlockButtonType): React.ReactElement {
	return (
		<Button
			onClick={onClick}
			block
			className={`btn-block ${
				color === "black"
					? "bg-black text-white border-gray-500 hover:border-blac hover:text-gray-300"
					: "bg-white text-black border-gray-100 hover:border-gray-300 hover:text-gray-700"
			}`}
		>
			{children}
		</Button>
	);
}

export default BlockButton;
