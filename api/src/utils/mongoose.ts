import mongoose, { ConnectOptions } from "mongoose";

mongoose.Promise = global.Promise;

const connectToDatabase = async (url: string): Promise<void> => {
	const options = {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
	} as ConnectOptions;

	await mongoose.connect(url, options);
};

export { connectToDatabase };
