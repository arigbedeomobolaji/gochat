import BlockButton from "../BlockButton";
import FormHeader from "../FormHeader";
import { Input, Button } from "antd";
import FormInput from "../FormInput";

type LoginUIType = {
	handleIsSignUp: (bool: boolean) => void;
};

export default function LoginUI({
	handleIsSignUp,
}: LoginUIType): React.ReactElement {
	return (
		<>
			<FormHeader action="In" />
			<form className="space-y-5 py-6">
				<FormInput
					label="Username or Email"
					placeholder="Username or Email"
				/>
				<div>
					<h3 className="text-gray-900 mb-4 pl-3">Password</h3>
					<Input.Password
						placeholder="Password"
						className="my-input"
					/>
				</div>
				<div>
					<BlockButton color="black">Sign In</BlockButton>
					<p className="text-center text-gray-500 text-xs">
						Don't have an Account?{" "}
						<Button
							type="text"
							className="text-xs p-0 font-lato bg-none hover:bg-none"
							onClick={() => handleIsSignUp(true)}
						>
							Sign Up
						</Button>
					</p>
				</div>
			</form>
		</>
	);
}
