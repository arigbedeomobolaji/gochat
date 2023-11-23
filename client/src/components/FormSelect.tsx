import React from "react";
import { Select } from "antd";
import { BaseOptionType } from "antd/es/select";
//
type FormSelectType = {
	label: string;
	options: BaseOptionType[];
	onChange?: React.KeyboardEventHandler<HTMLElement>;
};

function FormSelect({
	label,
	options,
	onChange,
}: FormSelectType): React.ReactElement {
	return (
		<div className="w-full">
			<h3 className="text-gray-900 mb-4 pl-3">{label}</h3>
			<Select
				placeholder={label}
				className="w-full h-12"
				allowClear
				options={options}
				onChange={onChange}
			/>
		</div>
	);
}

export default FormSelect;
