import mongoose, { Document, Schema, Model } from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import beautifyUnique from "mongoose-beautiful-unique-validation";
import createHttpError from "http-errors";
import { expiresIn } from "../utils";
dotenv.config();

const saltRounds = Number(process.env.SALT_ROUNDS);
const tokenSecret = process.env.TOKEN_SECRET as string;

interface UserDocument extends Document {
  _id: Schema.Types.ObjectId;
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
  isActive: boolean;
  tokens: { token: string; _id: Schema.Types.ObjectId }[];
  generateAuthToken(): string;
}

export interface UserModel extends Model<UserDocument> {
  findByCredentials(email: string, password: string): UserDocument;
  findOrCreate(name: string, email: string, username: string): UserDocument;
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
      lowercase: true,
    },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true },
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
    isActive: {
      type: Boolean,
      default: false,
    },
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

// Enable beautifying on this schema
userSchema.plugin(beautifyUnique);

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, saltRounds);
    }
    next();
  } catch (error) {
    throw error;
  }
});

// Generate Auth token for user
userSchema.methods.generateAuthToken = async function () {
  try {
    const user = this;
    // Generate Auth token for user
    const token = await jwt.sign(
      {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        location: user.location,
      },
      tokenSecret,
      { expiresIn }
    );

    // save the authtoken to db
    user.tokens = user.tokens.concat({ token });
    const savedToken = await user.save();
    if (!savedToken) {
      throw { error: { message: "error occurred try again" } };
    }
    return token;
  } catch (error) {
    return error;
  }
};

// FindByCredentials - find user by email and password
userSchema.statics.findByCredentials = async (
  userAuthInput: string,
  password: string
) => {
  const criterion = userAuthInput.includes("@")
    ? { ["email"]: userAuthInput }
    : { ["username"]: userAuthInput };
  const user = await User.findOne(criterion);
  if (!user) {
    throw createHttpError.Unauthorized(
      "Please Authenticate with the correct credentials"
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError.Unauthorized(
      "Please authenticate with the correct Credentials"
    );
  }
  return user;
};

// findOrCreate
userSchema.statics.findOrCreate = async (
  name: string,
  email: string,
  username: string
) => {
  try {
    // Check if an existing email is in the DB
    let user = await User.findOne({ email });
    if (user) {
      return user;
    }
    // if not, check if an existing username is in DB
    user = await User.findOne({ username });
    if (user) {
      return user;
    }
    // Create a new user in the DB.
    user = await User.create({ name, email, username, password: "test" });
    return user;
  } catch (error) {
    return error;
  }
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
