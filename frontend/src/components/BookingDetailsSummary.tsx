import { HotelType } from '../../../backend/src/shared/types';

type Props = {
	checkIn: Date;
	checkOut: Date;
	adultCount: number;
	childCount: number;
	hotel: HotelType;
	numberOfNights: number;
};

const BookingDetailsSummary = ({
	checkIn,
	checkOut,
	numberOfNights,
	hotel,
	adultCount,
	childCount,
}: Props) => {
	return (
		<div className='grid gap-4 p-5 rounded-lg border-slate-300 h-fit'>
			<h2 className='text-xl font-bold'>Your Booking Details</h2>

			<div className='py-2 border-b'>
				locations:
				<div className='font-bold'>
					{`${hotel.name}, ${hotel.city} , ${hotel.country}`}
				</div>
				<div className='flex justify-between'>
					<div>
						Check-in
						<div className='font-bold'>{checkIn.toDateString()}</div>
					</div>
					<div>
						Check-out
						<div className='font-bold'>{checkOut.toDateString()}</div>
					</div>
				</div>
				<div className='py-2 border-t border-b'>
					Total length of stay:
					<div className='font-bold'> {numberOfNights} nights </div>
				</div>
				<div>
					Guests
					<div className='font-bold'>
						{adultCount} adults & {childCount} children
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingDetailsSummary;