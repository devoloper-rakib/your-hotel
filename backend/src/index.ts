import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';

import userRoutes from './routes/users';
import authRoutes from './routes/Auth';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health route Checkpoint
app.get('/api/health', async (req: Request, res: Response) => {
	res.json({ message: ' api health is okay' });
});

app.listen(8000, () => {
	console.log(`Server is running on localhost:8000`);
});
