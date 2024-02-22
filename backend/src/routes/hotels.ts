import express, { Request, Response } from 'express';
import { validationResult, param } from 'express-validator';
import Stripe from 'stripe';

import Hotel from '../models/hotel';
import { BookingType, HotelSearchResponse } from '../shared/types';
import verifyToken from '../middleware/auth';

const router = express.Router();

// POint: stripe integrate
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

// Point : search functionality
router.get('/search', async (req: Request, res: Response) => {
	try {
		// point : searching
		const query = constructSearchQuery(req.query);

		let sortOptions = {};
		switch (req.query.sortOption) {
			case 'starRating':
				sortOptions = { starRating: -1 };
				break;
			case 'pricePerNightAsc':
				sortOptions = { pricePerNight: 1 };
				break;
			case 'pricePerNightDesc':
				sortOptions = { pricePerNight: -1 };
				break;
		}

		const pageSize = 5;
		const pageNumber = parseInt(
			req.query.page ? req.query.page.toString() : '1',
		);

		const skip = (pageNumber - 1) * pageSize;

		const hotels = await Hotel.find(query)
			.sort(sortOptions)
			.skip(skip)
			.limit(pageSize);

		const total = await Hotel.countDocuments(query);

		const response: HotelSearchResponse = {
			data: hotels,
			pagination: {
				total,
				page: pageNumber,
				pages: Math.ceil(total / pageSize),
			},
		};
		res.json(response);
	} catch (error) {
		console.log('Error getting search Results', error);
		res.status(500).json({ message: 'Something went wrong' });
	}
});

// Point : searching algorithm/ query v2
// const constructSearchQuery = (queryParams: any) => {
// 	let constructedQuery: any = {};

// 	if (queryParams.destination) {
// 		constructedQuery.$or = [
// 			{ city: new RegExp(queryParams.destination, 'i') },
// 			{ country: new RegExp(queryParams.destination, 'i') },
// 		];
// 	}

// 	if (queryParams.adultCount) {
// 		constructedQuery.adultCount = {
// 			$gte: parseInt(queryParams.adultCount),
// 		};
// 	}

// 	if (queryParams.childCount) {
// 		constructedQuery.childCount = {
// 			$gte: parseInt(queryParams.childCount),
// 		};
// 	}

// 	if (queryParams.facilities) {
// 		constructedQuery.facilities = {
// 			$all: Array.isArray(queryParams.facilities)
// 				? queryParams.facilities.map(
// 						(facility: string) => new RegExp(facility, 'i'),
// 				  )
// 				: [new RegExp(queryParams.facilities, 'i')],
// 		};
// 	}

// 	if (queryParams.types) {
// 		constructedQuery.type = {
// 			$in: Array.isArray(queryParams.types)
// 				? queryParams.types.map((type: string) => new RegExp(type, 'i'))
// 				: [new RegExp(queryParams.types, 'i')],
// 		};
// 	}

// 	if (queryParams.stars) {
// 		constructedQuery.starRating = {
// 			$in: Array.isArray(queryParams.stars)
// 				? queryParams.stars.map((star: string) => parseInt(star))
// 				: [parseInt(queryParams.stars)],
// 		};
// 	}

// 	if (queryParams.maxPrice) {
// 		constructedQuery.pricePerNight = {
// 			$lte: parseInt(queryParams.maxPrice),
// 		};
// 	}

// 	return constructedQuery;
// };

// Point: get single hotel details
router.get(
	'/:id',
	[param('id').notEmpty().withMessage('Hotel ID is required')],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const id = req.params.id.toString();

		try {
			const hotel = await Hotel.findById(id);
			res.json(hotel);
		} catch (error) {
			console.log('error getting hotel data', error);
			res.status(500).json({ message: 'Error fetching hotel data' });
		}
	},
);

// Point: Strip payment integrate
router.post(
	'/:hotelId/bookings/payment-intent',
	verifyToken,
	async (req: Request, res: Response) => {
		// / 1) hotelId
		const { numberOfNights } = req.body;
		const hotelId = req.params.hotelId;

		const hotel = await Hotel.findById(hotelId);
		if (!hotel) return res.status(400).json({ message: 'Hotel Not Found' });

		// / 2) Total Cost
		const totalCost = hotel.pricePerNight * numberOfNights;

		// / 3) userId
		// const paymentIntent = await stripe.paymentIntents.create({
		// 	amount: totalCost,
		// 	currency: 'usd',
		// 	metadata: {
		// 		hotelId,
		// 		userId: req.userId,
		// 	},
		// 	description: 'Payment intent',
		// 	// error : stripe payment failed check console for more information
		// });

		const paymentIntent = await stripe.paymentIntents.create({
			amount: totalCost * 100, 
			currency: 'usd',
			metadata: {
				hotelId,
				userId: req.userId,
			},
			description: 'Payment intent',
			payment_method_types: ['card'],
		});

		if (!paymentIntent.client_secret) {
			return res.status(500).json({ message: 'Error creating payment intent' });
		}

		const response = {
			paymentIntent: paymentIntent.id,
			clientSecret: paymentIntent.client_secret.toString(),
			totalCost,
		};
		res.send(response);
	},
);

// Point: Booking end point
router.post(
	'/:hotelId/bookings',
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const paymentIntentId = req.body.paymentIntentId;

			const paymentIntent = await stripe.paymentIntents.retrieve(
				paymentIntentId as string,
			);

			console.log(paymentIntent);

			if (!paymentIntent)
				return res.status(400).json({ message: 'Payment intent  not found' });

			if (
				paymentIntent.metadata.hotelId !== req.params.hotelId ||
				paymentIntent.metadata.userId !== req.userId
			) {
				return res.status(400).json({ message: 'payment intent mismatch' });
			}

			if (paymentIntent.status !== 'succeeded') {
				return res.status(400).json({
					message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
				});
			}

			const newBooking: BookingType = {
				...req.body,
				userId: req.userId,
			};

			const hotel = await Hotel.findOneAndUpdate(
				{ _id: req.params.hotelId },
				{ $push: { bookings: newBooking } },
			);

			if (!hotel) return res.status(400).json({ message: 'Hotel not found' });

			console.log(hotel);

			await hotel.save();
			res.status(200).send();
		} catch (error) {
			console.log('error getting booking data', error);
			res.status(500).json({ message: 'Something  went wrong' });
		}
	},
);

// POINT :  searching algorithm/ query v1
const constructSearchQuery = (queryParams: any) => {
	let constructedQuery: any = {};

	if (queryParams.destination) {
		constructedQuery.$or = [
			{ city: new RegExp(queryParams.destination, 'i') },
			{ country: new RegExp(queryParams.destination, 'i') },
		];
	}

	if (queryParams.adultCount) {
		constructedQuery.adultCount = {
			$gte: parseInt(queryParams.adultCount),
		};
	}

	if (queryParams.childCount) {
		constructedQuery.childCount = {
			$gte: parseInt(queryParams.childCount),
		};
	}

	if (queryParams.facilities) {
		constructedQuery.facilities = {
			$all: Array.isArray(queryParams.facilities)
				? queryParams.facilities
				: [queryParams.facilities],
		};
	}

	if (queryParams.types) {
		constructedQuery.type = {
			$in: Array.isArray(queryParams.types)
				? queryParams.types
				: [queryParams.types],
		};
	}

	if (queryParams.stars) {
		const starRatings = Array.isArray(queryParams.stars)
			? queryParams.stars.map((star: string) => parseInt(star))
			: parseInt(queryParams.stars);

		constructedQuery.starRating = { $in: starRatings };
	}

	if (queryParams.maxPrice) {
		constructedQuery.pricePerNight = {
			$lte: parseInt(queryParams.maxPrice).toString(),
		};
	}

	return constructedQuery;
};

export default router;
