import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { body } from 'express-validator';

import Hotel from '../models/hotel';
import verifyToken from '../middleware/auth';
import { HotelType } from '../shared/types';

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
	// error : preventing type error  handling
	if (!imageFiles) return [];

	const uploadPromises = imageFiles.map(async (image) => {
		const b64 = Buffer.from(image.buffer).toString('base64');
		let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
		const res = await cloudinary.v2.uploader.upload(dataURI);
		return res.url;
	});

	const imageUrls = await Promise.all(uploadPromises);
	return imageUrls;
}

// Point: My hotel information api endpoint
router.get('/', verifyToken, async (req: Request, res: Response) => {
	try {
		const hotels = await Hotel.find({ userId: req.userId });
		res.json(hotels);
	} catch (error) {
		console.log('error fetching hotels information:', error);
		res.status(500).json({
			message: 'Error fetching  hotels information',
		});
	}
});

// Point : edit my hotels api endpoint
router.get('/:id', verifyToken, async (req: Request, res: Response) => {
	const id = req.params.id.toString();

	try {
		// to edit the hotel and populate the data from the database
		const hotel = await Hotel.findOne({
			_id: id,
			userId: req.userId,
		});

		res.json(hotel);
	} catch (error) {
		console.log('error on edit hotel', error);
		res.status(500).json({
			message: 'Error fetching hotels',
		});
	}
});

// Point : update my hotel
// router.put(
// 	'/:hotelId',
// 	verifyToken,
// 	upload.array('imagesUrls'),
// 	async (req: Request, res: Response) => {
// 		try {
// 			const updatedHotel: HotelType = req.body;
// 			updatedHotel.lastUpdated = new Date();

// 			const hotel = await Hotel.findOneAndUpdate(
// 				{
// 					_id: req.params.hotelId,
// 					userId: req.userId,
// 				},
// 				updatedHotel,
// 				{ new: true },
// 			);

// 			if (!hotel) return res.status(404).json({ message: 'hotel not found' });

// 			const files = req.files as Express.Multer.File[];

// 			const updatedImageUrls = await uploadImages(files);

// 			hotel.imageUrls = [
// 				...updatedImageUrls,
// 				...(updatedHotel.imageUrls || []),
// 			];

// 			await hotel.save();

// 			res.status(201).json(hotel);
// 		} catch (error) {
// 			console.log('Error updating image file', error);
// 			res.status(500).json({ message: 'Error updating image file' });
// 		}
// 	},
// );

export default router;
