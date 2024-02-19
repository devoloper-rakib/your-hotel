export type HotelType = {
	_id: string;
	userId: string;
	name: string;
	city: string;
	country: string;
	description: string;
	type: string;
	adultCount: number;
	childCount: number;
	facilities: string[];
	pricePerNight: number;
	starRating: number;
	imageUrls: string[];
	lastUpdated: Date;
	bookings: BookingType[];
};

export type HotelSearchResponse = {
	data: HotelType[];
	pagination: {
		total: number;
		page: number;
		pages: number;
	};
};

export type UserType = {
	_id: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
};

export type PaymentIntentResponse = {
	paymentIntentId: string;
	clientSecret: string;
	totalCost: number;
};

export type BookingType = {
	_id: string;
	firstName: string;
	lastName: string;
	userId: string;
	email: string;
	adultCount: number;
	childCount: number;
	totalCost: number;
	checkIn: Date;
	checkOut: Date;
};
