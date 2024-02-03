import express, { Request, Response } from 'express';
import path from 'path';

import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

import userRoutes from './routes/users';
import authRoutes from './routes/authRoutes';

cloudinary.config({
	cloud_name: process.env.CLOUDNIARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDNIARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
	console.log(
		'Connected To database : ',
		process.env.MONGODB_CONNECTION_STRING,
	);
}); // todo : will delete after the development backend is finished

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
);

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health route Checkpoint
app.get('/api/health', async (req: Request, res: Response) => {
	res.json({ message: ' api health is okay' });
});

app.listen(8000, () => {
	console.log(`Server is running on localhost:8000`);
});
