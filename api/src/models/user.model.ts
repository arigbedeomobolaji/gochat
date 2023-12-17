import mongoose, { Document, Schema, Model } from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
dotenv.config();

const saltRounds = Number(process.env.SALT_ROUNDS);
const tokenSecret = process.env.TOKEN_SECRET as string;

interface UserDocument extends Document {
	name: string;
	dateOfBirth?: Date;
	location: {
		country: string;
		city: string;
	};
	email: string;
	username: string;
	friends: Schema.Types.ObjectId[];
	password: string;
	tokens: { token: string; _id: Schema.Types.ObjectId }[];
	generateAuthToken(): () => void;
}

export interface UserModel extends Model<UserDocument> {
	findByCredentials(email: string, password: string): UserDocument;
}

type UserInput = {
	name: UserDocument["name"];
	location: UserDocument["location"];
	email: UserDocument["email"];
	username: UserDocument["email"];
	password: UserDocument["password"];
};

function validation(value: string) {
	return validator.isEmail(value);
}

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			index: true,
			validate: [validation, "Must provide an Email"],
		},
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
		tokens: [
			{
				token: {
					type: String,
				},
			},
		],
	},
	{
		timestamps: true,
		collection: "users",
	}
);

userSchema.pre("save", async function (next) {
	try {
		const user = this;
		if (user.isModified("password")) {
			user.password = await bcrypt.hash(user.password, saltRounds);
		}
		next();
	} catch (error) {
		console.log({ error });
	}
});

// Generaet Auth token for user
userSchema.methods.generateAuthToken = async function () {
	try {
		const user = this;
		// Generate Auth token for user
		const token = await jwt.sign(
			{ id: user._id.toString(), email: user.email },
			tokenSecret,
			{ expiresIn: "3h" }
		);

		// save the authtoken to db
		user.tokens = user.tokens.concat({ token });
		const savedToken = await user.save();
		if (!savedToken) {
			throw { error: "error occurred" };
		}
		return token;
	} catch (error) {
		return error;
	}
};

// FindByCredentials - find user by email and password
userSchema.statics.findByCredentials = async (
	email: string,
	password: string
) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw { error: "Please Authenticate with the correct credentials" };
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw { error: "Please authenticate with the correct Credentials" };
	}
	return user;
};

// Delete confidential fields
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);
export { User, UserDocument, UserInput };
