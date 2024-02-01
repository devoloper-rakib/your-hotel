import { RegisterFormData } from './pages/Register';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
