import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import BookingForm from '../forms/BookingForm/BookingForm';
import { useSearchContext } from '../contexts/SearchContext';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BookingDetailsSummary from '../components/BookingDetailsSummary';
import { Elements } from '@stripe/react-stripe-js';
import { useAppContext } from '../contexts/AppContext';

const Booking = () => {
	const search = useSearchContext();
	const { stripePromise } = useAppContext();
	const { hotelId } = useParams();

	const [numberOfNights, setNumberOfNights] = useState<number>(0);

	useEffect(() => {
		if (search.checkIn && search.checkOut) {
			const nights =
				Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
				(1000 * 60 * 60 * 24);

			setNumberOfNights(Math.ceil(nights));
		} else {
			setNumberOfNights(0);
		}
	}, [search.checkIn, search.checkOut]);

	// Point Payment intent data
	const { data: paymentIntentData } = useQuery(
		'createPaymentIntent',
		() =>
			apiClient.createPaymentIntent(
				hotelId as string,
				// numberOfNights.toString(),
				numberOfNights,
			),
		{
			enabled: !!hotelId && numberOfNights > 0,
		},
	);

	const { data: hotel } = useQuery(
		'fetchHotelIdByID',
		() => apiClient.fetchHotelById(hotelId as string),
		{
			enabled: !!hotelId,
		},
	);

	const { data: currentUser } = useQuery(
		'fetchCurrentUser',
		apiClient.fetchCurrentUser,
	);

	// console.log(currentUser?.email);

	// console.log(paymentIntentData);
	if (!hotel) return <></>;

	return (
		<div className='grid md:grid-cols-[1fr_2fr]'>
			<BookingDetailsSummary
				checkIn={search.checkIn}
				checkOut={search.checkOut}
				adultCount={search.adultCount}
				childCount={search.childCount}
				hotel={hotel}
				numberOfNights={numberOfNights}
			/>

			{currentUser && paymentIntentData && (
				<Elements
					stripe={stripePromise}
					options={{
						clientSecret: paymentIntentData.clientSecret,
					}}
				>
					<BookingForm
						currentUser={currentUser}
						paymentIntent={paymentIntentData}
					/>
				</Elements>
			)}
		</div>
	);
};

export default Booking;
