import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { body } from 'express-validator';

import Hotel, { HotelType } from '../models/hotel';
import verifyToken from '../middleware/auth';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5mb
	},
}).array('imageFiles', 6);

// / api/my-hotels
router.post(
	'/',
	verifyToken,
	[
		body('name').notEmpty().withMessage('Name is required'),
		body('city').notEmpty().withMessage('City is required'),
		body('country').notEmpty().withMessage('Country is required'),
		body('description').notEmpty().withMessage('Description is required'),
		body('type').notEmpty().withMessage('Hotel type is required'),
		body('pricePerNight')
			.notEmpty()
			.isNumeric()
			.withMessage('Price per night is required and must be a number'),
		body('facilities')
			.notEmpty()
			.isArray()
			.withMessage('Facilities are required'),
	],
	(req: Request, res: Response) => {
		upload(req, res, async (uploadErr: any) => {
			if (uploadErr) {
				console.error('Error uploading files:', uploadErr);
				return res
					.status(400)
					.json({ message: 'Error uploading files', error: uploadErr });
			}

			try {
				const imageFiles = req.files as Express.Multer.File[];
				const newHotel: HotelType = req.body;

				const imageUrls = await uploadImages(imageFiles);

				newHotel.imageUrls = imageUrls;
				newHotel.lastUpdated = new Date();
				newHotel.userId = req.userId;

				const hotel = new Hotel(newHotel);
				await hotel.save();
				console.log(hotel);
				res.status(201).send(hotel);
			} catch (error) {
				console.error('Error creating hotel:', error);
				res.status(500).json({ message: 'Something went wrong' });
			}
		});
	},
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
	const uploadPromises = imageFiles.map(async (image) => {
		const b64 = Buffer.from(image.buffer).toString('base64');
		let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
		const res = await cloudinary.v2.uploader.upload(dataURI);
		return res.url;
	});

	const imageUrls = await Promise.all(uploadPromises);
	return imageUrls;
}

router.get('/', (req: Request, res: Response) => {
	res.send('api okay');
});

export default router;
