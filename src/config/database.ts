import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUser = encodeURIComponent(process.env.DB_USER!);
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD!);
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

const uri = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

export default async function connectDB() {
	try {
		await mongoose.connect(uri, {
			serverApi: {
				version: '1',
				strict: true,
				deprecationErrors: true
			}
		});
		await mongoose.connection.db!.admin().command({ ping: 1 });
		console.log('Pinged your deployment. You successfully connected to MongoDB!');
	} catch (err) {
		console.error('Error connecting to MongoDB:', err);
	}
}