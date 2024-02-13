import { RegisterFormData } from './pages/Register';
import { SignInFormData } from './pages/SignIn';
import { HotelSearchResponse, HotelType } from '../../backend/src/shared/types';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Point : register api fetch
export const register = async (formData: RegisterFormData) => {
	const response = await fetch(`${API_BASE_URL}/api/users/register`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData),
	});

	const responseBody = await response.json();

	if (!response.ok) {
		throw new Error(responseBody.message);
	}
};

export const signIn = async (formData: SignInFormData) => {
	const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},

		body: JSON.stringify(formData),
	});

	const body = await response.json();

	if (!response.ok) {
		throw new Error(body.message);
	}

	return body;
};

// Point : validate TOken data
export const validateToken = async () => {
	const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
		credentials: 'include',
	});

	// console.log('response token', response);
	if (!response.ok) {
		throw new Error('Token Invalid');
	}

	return response.json();
};

// Point: user  signed out
export const signOut = async () => {
	const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
		method: 'POST',
		credentials: 'include',
	});

	if (!response.ok) {
		throw new Error('Error during Sign out');
	}
};

// Point : add hotel
export const addMyHotel = async (hotelFormData: FormData) => {
	const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
		method: 'POST',
		credentials: 'include',
		body: hotelFormData,
	});

	if (!response.ok) {
		throw new Error('Failed to add hotel');
	}

	return response.json();
};

// Point : get Hotel information
export const fetchMyHotels = async (): Promise<HotelType[]> => {
	const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
		credentials: 'include',
	});

	if (!response.ok) {
		throw new Error('Error fetching my-hotels information');
	}

	return response.json();
};

// Point : edit hotel
export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
	const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
		credentials: 'include',
	});

	if (!response.ok) {
		throw new Error('Error fetching my-hotels');
	}

	return response.json();
};

// Point : updated my hotel
export const updateMyHotelById = async (hotelFormData: FormData) => {
	const response = await fetch(
		`${API_BASE_URL}/api/my-hotels/${hotelFormData.get('hotelId')}`,
		{
			method: 'PUT',
			body: hotelFormData,
			credentials: 'include',
		},
	);

	if (!response.ok) {
		throw new Error('Failed to update Hotel');
	}

	return response.json();
};

// Point : search Fetching data
export type SearchParams = {
	destination?: string;
	checkIn?: string;
	checkOut?: string;
	adultCount?: string;
	childCount?: string;
	page?: string;
};

export const searchHotels = async (
	searchParams: SearchParams,
): Promise<HotelSearchResponse> => {
	const queryParams = new URLSearchParams();
	queryParams.append('destination', searchParams.destination || '');
	queryParams.append('checkIn', searchParams.checkIn || '');
	queryParams.append('checkOut', searchParams.checkOut || '');
	queryParams.append('adultCount', searchParams.adultCount || '');
	queryParams.append('childCount', searchParams.childCount || '');
	queryParams.append('page', searchParams.page || '');

	const response = await fetch(
		`${API_BASE_URL}/api/hotels/search?${queryParams.toString()}`,
	);

	if (!response.ok) {
		throw new Error(`Error Fetching hotels : ${queryParams.toString()}`);
	}

	return response.json();
};
