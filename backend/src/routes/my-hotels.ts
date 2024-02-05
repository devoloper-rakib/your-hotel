import express, { Request, Response } from 'express';
const router = express.Router();
import multer from 'multer';
import cloudinary from 'cloudinary';
import { body } from 'express-validator';

import Hotel, { HotelType } from '../models/hotel';
import verifyToken from '../middleware/auth';

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5mb
	},
});

// / api/my-hotels
router.post(
	'/',
	verifyToken,
	[
		body('name').notEmpty().withMessage('Hotel Name is required'),
		body('city').notEmpty().withMessage('City name is required'),
		body('Country').notEmpty().withMessage('Country name is required'),
		body('description').notEmpty().withMessage('description  is required'),
		body('type').notEmpty().withMessage('Hotel type  is required'),
		body('pricePerNight')
			.notEmpty()
			.isNumeric()
			.withMessage('Price per night  is required and must be a number '),
		body('facilities')
			.notEmpty()
			.isArray()
			.withMessage('Facilities  are required'),
	],
	upload.array('imageFiles', 6),
	async (req: Request, res: Response) => {
		try {
			const imageFiles = req.files as Express.Multer.File[];
			const newHotel: HotelType = req.body;

			// point: 1) Upload the images to cloudinary
			const uploadPromises = imageFiles.map(async (image) => {
				const b64 = Buffer.from(image.buffer).toString('base64');
				let dataURL = 'data:' + image.mimetype + ';base64,' + b64;

				const res = await cloudinary.v2.uploader.upload(dataURL);
				return res.url;
			});

			// point: 2) if upload was successful , add the URLs to the new hotel
			const imageUrls = await Promise.all(uploadPromises);
			newHotel.imageUrls = imageUrls;
			newHotel.lastUpdated = new Date();
			newHotel.userId = req.userId;

			// Point : 3) save the new hotel in our database
			const hotel = new Hotel(newHotel);
			await hotel.save();

			// 4) return a 201 status code
			res.status(201).send(hotel);
		} catch (error) {
			console.log('Error creating hotel: ', error);
			res.status(500).json({
				message: 'Something went wrong! try again ',
			});
		}
	},
);

export default router;