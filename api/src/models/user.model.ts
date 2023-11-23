import mongoose, { Document, Schema, Model, InferSchemaType } from "mongoose";

type UserDocType = {
	name: string;
	dateOfBirth: Date;
	location: {
		country: string;
		city: string;
	};
	email: string;
	username: string;
	friends: Schema.Types.ObjectId[];
	password: String;
};
type UserDocument = {
	createdAt: NativeDate;
	updatedAt: NativeDate;
} & UserDocType;

type UserInput = {
	name: UserDocument["name"];
	dataOfBirth: UserDocument["dateOfBirth"];
	location: UserDocument["location"];
	email: UserDocument["email"];
	username: UserDocument["email"];
	friends: UserDocument["friends"];
	password: UserDocument["password"];
};

const userSchema = new Schema(
	{
		email: { type: String, required: true, unique: true, index: true },
		name: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		location: {
			country: { type: String },
			city: { type: String },
		},
		friends: [
			{
				type: Schema.Types.ObjectId,
			},
		],
	},
	{
		timestamps: true,
		collection: "users",
	}
);

const User: Model<InferSchemaType<typeof userSchema>> = mongoose.model(
	"User",
	userSchema
);
export { User, UserDocument, UserInput };
