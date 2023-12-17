/* eslint-disable no-throw-literal */
import type { UserInput } from "../models/user.model";
export function validOperation(allowedField: string[], updateObject: UserInput) {
	const providedFields: string[] = Array.isArray(updateObject)
		? updateObject
		: Object.keys(updateObject);
	if (!providedFields.length) {
		throw {
			status: 400,
			warning:
				"No Data was provided. Are you sure you want to update the database.",
		};
	}
	const validOperation = providedFields.every((field, index) =>
		allowedField.includes(field)
	);
	if (!validOperation) {
		throw {
			error: `The allowed fields are ${allowedField.join(",")}`,
		};
	}
	return providedFields;
}
