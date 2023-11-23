import { Input } from "antd";
import React from "react";

type FormInputType = {
	type?: string;
	placeholder: string;
	label: string;
	minLength?: number;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
};

function FormInput({
	placeholder,
	label,
	minLength,
	onChange,
}: FormInputType): React.ReactElement {
	return (
		<div className="mb-10">
			<h3 className="text-gray-900 mb-4">{label}</h3>
			<Input
				placeholder={placeholder}
				className="my-input"
				onChange={onChange}
				minLength={minLength}
			/>
		</div>
	);
}

export default FormInput;
