import mongoose, { ConnectOptions } from 'mongoose';
import 'dotenv/config';

export const mongooseConnect = () => {
	mongoose
		.connect(
			process.env.MONGO_CONNECTION_URI as string,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			} as ConnectOptions
		)
		.then(() => {
			console.log('🍃 Connected to MongoDB');
		})
		.catch((err) => {
			console.error('Error connecting to MongoDB', err);
		});
};
