import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

import User from '../model/User';
const router = express.Router();

// Point : FOR Register a users
router.post(
	'/register',
	[
		// check validation before POSTing
		check('firstName', 'First Name is Required').isString(),
		check('lastName', 'Last Name is Required').isString(),
		check('email', 'Email is Required').isEmail(),
		check('password', 'Password with 6 or more characters required ').isLength({
			min: 6,
		}),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		// handle errors that are not valid
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: errors.array() });
		}

		try {
			let user = await User.findOne({
				email: req.body.email,
			});

			if (user) {
				return res.status(400).json({
					message: 'user Already Exists',
				});
			}

			user = new User(req.body);
			await user.save();

			const token = jwt.sign(
				{ userId: user.id },
				process.env.JWT_SECRET_KEY as string,
				{
					expiresIn: '1d',
				},
			);

			res.cookie('Auth Cookie/token =>>>', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 86400000,
			});

			return res.status(200).send({ message: 'User Registered successfully' });
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: 'Something went  wrong' });
		}
	},
);

export default router;