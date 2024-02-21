import { useForm } from 'react-hook-form';
import {
	PaymentIntentResponse,
	UserType,
} from '../../../../backend/src/shared/types';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';

type Props = {
	currentUser: UserType;
	paymentIntent: PaymentIntentResponse;
};

type BookingFormData = {
	firstName: string;
	lastName: string;
	email: string;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
	const stripe = useStripe();
	const elements = useElements();

	const { register, handleSubmit } = useForm<BookingFormData>({
		defaultValues: {
			firstName: currentUser.firstName,
			lastName: currentUser.lastName,
			email: currentUser.email,
		},
	});

	const onSubmit = async ({ formData: BookingFormData }) => {
		if (!stripe || !elements) return;

		const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement) as StripeCardElement,
			},
		});

		if ( result.paymentIntent?.status === 'succeeded'){
			// Point:) book the room/cabin
			
		}
	};

	return (
		<form className='grid grid-cols-1 gap-5 p-5 border rounded-lg border-slate-300 '>
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
		</form>
	);
};

export default BookingForm;
