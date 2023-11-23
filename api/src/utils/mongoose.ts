import mongoose, { ConnectOptions } from "mongoose";

mongoose.Promise = global.Promise;

const connectToDatabase = async (url: string): Promise<void> => {
	const options = {
		useNewUrlParser: true,
	} as ConnectOptions;

	try {
		await mongoose.connect(url, options);
		console.log("connected to database ✔️");
	} catch (error) {
		console.log("❌failed to connect to the DB", error);
	}
};

export { connectToDatabase };
