import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
	namespace Express {
		interface Request {
			userId: string;
		}
	}
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies['auth_token'];

	if (!token) {
		return res.status(401).send({ message: 'Unauthorized access' });
	}

	console.log('token on auth middleware', token);

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

		console.log('decoded token', decoded);

		req.userId = (decoded as JwtPayload).userId;

		next();
	} catch (error) {
		return res.status(401).send({ message: 'Unauthorized access' });
	}
};

export default verifyToken;
