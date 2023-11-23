import React, { useState } from "react";
import FormHeader from "../FormHeader";
import BlockButton from "../BlockButton";
import { Button } from "antd";
import FormInput from "../FormInput";
import { Input } from "antd";
import { FaChevronLeft } from "react-icons/fa6";

type RegisterUIType = {
	handleIsSignUp: (bool: boolean) => void;
};

function RegisterUI({ handleIsSignUp }: RegisterUIType): React.ReactElement {
	const [useEmail, setUseEmail] = useState(false);
	return (
		<>
			{useEmail ? (
				<form>
					<FaChevronLeft
						className="text-black w-10 h-10 absolute top-10 -left-20 cursor-pointer"
						onClick={() => setUseEmail(false)}
					/>
					<h1 className="mb-8 text-gray-900 text-[22px] font-bold">
						Sign up to GoChat
					</h1>
					<div className="flex gap-4">
						<FormInput label="Name" placeholder="Name" />
						<FormInput label="username" placeholder="username" />
					</div>

					<FormInput label="Email" placeholder="Email" />
					<div>
						<h3 className="text-gray-900 mb-4 pl-3">Password</h3>
						<Input.Password
							placeholder="Password"
							className="my-input mb-4"
						/>
					</div>
					<BlockButton color="black">Sign up</BlockButton>

					<p className="text-center text-gray-500 text-xs">
						Do you have an Account?{" "}
						<Button
							type="text"
							className="text-xs p-0 font-lato bg-none hover:bg-none"
							onClick={() => handleIsSignUp(false)}
						>
							Sign in
						</Button>
					</p>
				</form>
			) : (
				<div className="relative">
					<FormHeader action="Up" color="black" />
					<BlockButton onClick={() => setUseEmail(true)}>
						Continue
					</BlockButton>
				</div>
			)}
		</>
	);
}

export default RegisterUI;
