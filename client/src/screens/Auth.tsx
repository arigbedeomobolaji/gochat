import { useState } from "react";
import LoginUI from "@components/ui/LoginUI";
import chatLogo from "../assets/chat_logo.png";
import chatUI from "../assets/chatUI.png";
import RegisterUI from "@components/ui/RegisterUI";

export default function Auth() {
	const [isSignUp, setIsSignUp] = useState(false);
	console.log(isSignUp);

	function handleIsSignUp(bool: boolean): void {
		setIsSignUp(bool);
	}
	return (
		<div className="font-lato flex w-screen h-screen overflow-hidden m-0">
			<div className="bg-gray-950 text-white  w-1/4 p-5 pt-10 flex flex-col justify-between">
				<div className="flex flex-col  space-y-5">
					<div className="flex  items-center gap-3">
						<div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full">
							<img
								src={chatLogo}
								alt="chat_logo"
								className="w-full h-full object-cover"
							/>
						</div>

						<h3 className="text-blue-400 text-[22px] font-extrabold">
							GoChat
						</h3>
					</div>
					<h3 className="font-medium text-[30px] leading-10">
						We Create. You Chat and Enjoy.
					</h3>
					<p className="text-[16px] text-medium text-gray-500">
						We Bring Everybody Together
					</p>
				</div>
				<div>
					<div className="overflow-hidden">
						<img
							src={chatUI}
							alt="chatUI"
							className="-rotate-45 w-[200%]"
						/>
					</div>
				</div>
			</div>
			<div className="w-3/4 flex flex-col justify-center md:ml-24 relative">
				{!isSignUp ? (
					<div className="max-w-[400px] md:ml-10">
						<LoginUI handleIsSignUp={handleIsSignUp} />
					</div>
				) : (
					<div className="max-w-[500px] md:ml-10">
						<RegisterUI handleIsSignUp={handleIsSignUp} />
					</div>
				)}
			</div>
		</div>
	);
}
