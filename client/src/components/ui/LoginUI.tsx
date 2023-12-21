/* eslint-disable @typescript-eslint/no-unused-vars */
import BlockButton from "../BlockButton";
import FormHeader from "../FormHeader";
import { Input, Button } from "antd";
import FormInput from "../FormInput";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@src/queries/user.mutation";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { saveUser } from "@src/localStorage/userLocalStorage";
import { User } from "@src/types";

type LoginUIType = {
	handleIsSignUp: (bool: boolean) => void;
};

type AuthData = {
	token: string;
	user: User
}

export default function LoginUI({
	handleIsSignUp,
}: LoginUIType): React.ReactElement {
	const navigate = useNavigate();
	const [usernameOrEmail, setUsernameOrEmail] = useState("");
	const [cookies, setCookie] = useCookies(['access_token']);
	const [password, setPassword] = useState(""); 
	
	const mutation = useMutation({
		mutationFn: loginUser,
		onError(error) {
			setTimeout(() => {
				toast.error(error?.response?.data?.message || error.message, {
					position: "top-right",
					theme: "colored",
				})
			}, 1)
			
		},
		onSuccess(data) {
				const {token, user} = data.data as AuthData;
				setCookie('access_token', token, {path: "/"});
				saveUser(user);
				navigate("/");		
		},
	});
	let canContinue = !!usernameOrEmail && !!password;
	
	function handleUserLogin(){
		mutation.mutate({usernameOrEmail, password});
	}

	if(mutation.isPending) {
		canContinue = false
	}

	return (
		<>
			<FormHeader action="In" />
			<form className="space-y-5 py-6">
				<FormInput
					label="Username or Email"
					placeholder="Username or Email" 
					onChange={(event: ChangeEvent<HTMLInputElement>) => setUsernameOrEmail(event.target.value)}/>
				<div>
					<h3 className="text-gray-900 mb-4 pl-3">Password</h3>
					<Input.Password
						placeholder="Password"
						className="my-input"
						onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event?.target.value)}
					/>
				</div>
				<div>
					<BlockButton color="black" onClick={handleUserLogin} disabled={!canContinue}>Sign In</BlockButton>
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
			<ToastContainer autoClose={8000} />
		</>
	);
}
