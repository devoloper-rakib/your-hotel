import { useForm } from 'react-hook-form';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import { useSearchContext } from '../../contexts/SearchContext';
import { useParams } from 'react-router-dom';
import { useMutation } from 'react-query';

import {
	UserType,
	PaymentIntentResponse,
} from '../../../../backend/src/shared/types';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { useState } from 'react';

type Props = {
	currentUser: UserType;
	paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
	firstName: string;
	lastName: string;
	email: string;
	checkIn: string;
	checkOut: string;
	hotelId: string;
	paymentIntentId: string;
	adultCount: number;
	childCount: number;
	totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
	const stripe = useStripe();
	const elements = useElements();

	const search = useSearchContext();
	const { hotelId } = useParams();

	const { showToast } = useAppContext();

	const [isLoading, setIsLoading] = useState(false);

	const { mutate: bookRoom } = useMutation(apiClient.createRoomBooking, {
		onSuccess: () => {
			showToast({
				message: 'Booking Created Successfully!',
				type: 'SUCCESS',
			});
			setIsLoading(false);
		},

		onError: (error) => {
			console.log('error creating book', error);
			showToast({ message: 'Error Creating Booking', type: 'ERROR' });
			setIsLoading(false);
		},
	});

	const { register, handleSubmit } = useForm<BookingFormData>({
		defaultValues: {
			firstName: currentUser.firstName,
			lastName: currentUser.lastName,
			email: currentUser.email,

			adultCount: search.adultCount,
			childCount: search.childCount,
			checkIn: search.checkIn.toISOString(),
			checkOut: search.checkOut.toISOString(),
			hotelId: hotelId,
			paymentIntentId: paymentIntent.paymentIntentId,
			totalCost: paymentIntent.totalCost,
		},
	});

	const onSubmit = async (formData: BookingFormData) => {
		if (!stripe || !elements) return;

		setIsLoading(true);

		const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement) as StripeCardElement,
				billing_details: {
					name: formData.firstName + ' ' + formData.lastName,
					address: {
						line1: 'Address Line 1',
						line2: 'Address Line 2',
						city: 'City',
						state: 'State',
						postal_code: 'Postal Code',
						country: 'US',
					},
				},
			},
		});

		console.log('==>>>>>>>>>>>>', result);

		if (result.paymentIntent?.status === 'succeeded') {
			// Point: book the room/cabin
			bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
		}

		setIsLoading(false);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='grid grid-cols-1 gap-5 p-5 border rounded-lg border-slate-300 '
		>
			<span className='text-3xl font-bold'>Confirm Your Details </span>

			<div className='grid grid-cols-2 gap-6'>
				<label className='flex-1 text-sm font-bold text-gray-700 '>
					First Name
					<input
						type='text'
						readOnly
						disabled
						{...register('firstName')}
						className='w-full px-3 py-2 mt-1 font-normal text-gray-700 bg-gray-200 border rounded'
					/>
				</label>

				<label className='flex-1 text-sm font-bold text-gray-700 '>
					Last Name
					<input
						type='text'
						readOnly
						disabled
						{...register('lastName')}
						className='w-full px-3 py-2 mt-1 font-normal text-gray-700 bg-gray-200 border rounded'
					/>
				</label>

				<label className='flex-1 text-sm font-bold text-gray-700 '>
					Email
					<input
						type='email'
						readOnly
						disabled
						{...register('email')}
						className='w-full px-3 py-2 mt-1 font-normal text-gray-700 bg-gray-200 border rounded'
					/>
				</label>
			</div>

			<div className='space-y-2'>
				<h2 className='text-xl font-semibold'>Your Price Summary</h2>

				<div className='p-4 bg-blue-200 rounded-md'>
					<div className='text-lg font-semibold'>
						Total Cost :${paymentIntent.totalCost.toFixed(2)}
					</div>

					<div className='text-xs'>Includes taxes and charges</div>
				</div>
			</div>

			<div className='space-y-2'>
				<h3 className='text-xl font-semibold'>Payment Details</h3>

				<CardElement
					className='p-2 text-sm border rounded-md '
					id='payment-element'
				/>
			</div>

			<div className='flex justify-end'>
				<button
					disabled={isLoading}
					type='submit'
					className='p-2 font-bold text-white bg-blue-600 hover:bg-blue-500 text-md disabled:bg-gray-500'
				>
					{isLoading ? 'Creating...' : 'Confirm Booking'}
				</button>
			</div>
		</form>
	);
};

export default BookingForm;
