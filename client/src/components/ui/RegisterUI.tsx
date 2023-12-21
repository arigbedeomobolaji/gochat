/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import FormHeader from "../FormHeader";
import BlockButton from "../BlockButton";
import { Button } from "antd";
import FormInput from "../FormInput";
import { Input } from "antd";
import { FaChevronLeft } from "react-icons/fa6";
import FormSelect from "../FormSelect";
import { Country, City } from "country-state-city";
import _ from "lodash";
import validator from "validator";
import { useMutation } from "@tanstack/react-query";
import { UserInput, registerUser } from "../../queries/user.mutation";
import { useCookies } from "react-cookie";
import { saveUser } from "@src/localStorage/userLocalStorage";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

type optionsDataType = {
	label: string;
	value: string;
	isoCode: string;
};

const countryOptions: optionsDataType[] = _.uniqBy(
	Country.getAllCountries().map(({ name, isoCode }) => ({
		label: name[0].toUpperCase() + name.substring(1),
		value: name.toLowerCase(),
		isoCode,
	})),
	"value"
);

type RegisterUIType = {
	handleIsSignUp: (bool: boolean) => void;
};

const registerDataDefault: UserInput = {
	name: "",
	username: "",
	email: "",
	password: "",
	location: {
		country: "",
		city: "",
	}	
};

function RegisterUI({ handleIsSignUp }: RegisterUIType): React.ReactElement {
	const navigate = useNavigate();
	const [cityOptions, setCityOption] = useState([{ label: "", value: "" }]);
	const [registerData, setRegisterData] = useState(registerDataDefault);
	const [useEmail, setUseEmail] = useState(false);
	const [cookies,setCookie] = useCookies(['access_token']);
	const mutation = useMutation({
		mutationFn: registerUser,
		onError(error) {
			console.log("error", error.message, error.response.data.message)
			setTimeout(() => {
				toast.error(error?.response?.data?.message || error.message, {
					position: "top-right",
					theme: "colored",
				})
			}, 1)
		},
		onSuccess(data, variables, context) {
			const {token, user} = data.data;
			setCookie('access_token', token, {path: "/"});
			saveUser(user);
			navigate("/");

		},
	});

	let canContinue = (
		validator.isEmail(registerData.email) &&
		_.every(_.values(registerData), Boolean) && registerData.location.country && registerData.location.city
	);
	
	function handleSetRegisterData(name: string, value: string) {
		if(name === 'city' || name === "country") {
			setRegisterData((prevState) => ({
				...prevState,
				location: {
					...prevState.location,
					[name]: value
				}
			}))
		}else {
			setRegisterData((prevState) => ({
				...prevState,
				[name]: value.trim(),
			}));
		}
		
	}

	function handleCountryChange(country: never) {
		setCityOption([{ label: "", value: "" }]);

		const countryData = countryOptions.find(
			(countryOption) => countryOption.value == country
		);

		if (!countryData) {
			return;
		}
		handleSetRegisterData("country", country);

		const citiesOfCountry = _.uniqBy(
			City.getCitiesOfCountry(countryData?.isoCode)?.map(({ name }) => ({
				label: name[0].toUpperCase() + name.substring(1),
				value: name.toLowerCase(),
			})),
			"value"
		);
		if (citiesOfCountry) setCityOption(citiesOfCountry);
	}

	function handleUserRegistration(ev: React.FormEvent) {
		ev.preventDefault();
		if(canContinue) {
			mutation.mutate(registerData);
		}	
	}

	if(mutation.isPending) {
		canContinue = false
	}

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
						<FormInput
							label="Name"
							minLength={8}
							placeholder="Name"
							onChange={(event) =>
								handleSetRegisterData(
									"name",
									event.target.value
								)
							}
						/>
						<FormInput
							label="username"
							placeholder="username"
							minLength={4}
							onChange={(event) =>
								handleSetRegisterData(
									"username",
									event.target.value
								)
							}
						/>
					</div>

					<FormInput
						label="Email"
						placeholder="Email"
						onChange={(event) =>
							handleSetRegisterData("email", event.target.value)
						}
						type="email"
					/>
					<div>
						<h3 className="text-gray-900 mb-4 pl-3">Password</h3>
						<Input.Password
							placeholder="Password"
							className="my-input mb-4"
							onChange={(event) =>
								handleSetRegisterData(
									"password",
									event.target.value
								)
							}
						/>
					</div>
					<div className="flex gap-3 flex-wrap md:flex-nowrap items-center mb-10">
						<FormSelect
							label="Country"
							options={countryOptions}
							onChange={handleCountryChange}
						/>
						<FormSelect
							label="City"
							options={cityOptions}
							onChange={(value: never) =>
								handleSetRegisterData("city", value)
							}
						/>
					</div>

					<BlockButton onClick={handleUserRegistration} color="black" disabled={!canContinue}>
						Sign up
					</BlockButton>

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
			<ToastContainer />
		</>
	);
}

export default RegisterUI;
