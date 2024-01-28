import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health route Checkpoint
app.get('/api/health', async (req, res) => {
	res.json({ message: ' api health is okay' });
});

app.listen(8000, () => {
	console.log(`Server is running on localhost:8000`);
});
