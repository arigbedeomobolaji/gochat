import { Button, Divider } from "antd";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

type FormHeaderType = {
	color?: string;
	action: string;
};
const apiEndPoint = import.meta.env.VITE_API_URL

function FormHeader({ color, action }: FormHeaderType): React.ReactElement {
	
	return (
		<div>
			<h1 className="mb-8 text-gray-900 text-[22px] font-bold">
				Sign {action} to GoChat
			</h1>
			<Link to={`${apiEndPoint}/auth/google`} className="no-underline">
			<Button
				block
				className={`btn-block ${
					color === "black"
						? "bg-black text-white border-gray-500 hover:border-blac hover:text-gray-300"
						: "bg-white text-black border-gray-100 hover:border-gray-300 hover:text-gray-700"
				}`}
			>
				<FcGoogle />
				Sign {action} with Google
			</Button>
			</Link>
			
			<Divider orientation="left" plain>
				or
			</Divider>
		</div>
	);
}

export default FormHeader;
