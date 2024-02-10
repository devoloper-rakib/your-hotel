import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { BsBuilding, BsMap } from 'react-icons/bs';

import * as apiClient from '../api-client';
import { BiHotel, BiMoney, BiStar } from 'react-icons/bi';

const MyHotels = () => {
	const { data: hotelData } = useQuery(
		'fetchMyHotels',
		apiClient.fetchMyHotels,
		{
			onError: () => {},
		},
	);

	if (!hotelData) {
		return <span>No Hotels Found</span>;
	}

	return (
		<div className='space-y-5'>
			<span className='flex justify-between'>
				<h1 className='text-3xl font-bold'>My Hotels</h1>
				<Link
					to='/add-hotel'
					className='flex p-2 text-xl font-bold text-white bg-blue-600 hover:bg-blue-500'
				>
					Add Hotel
				</Link>
			</span>
			<div className='grid grid-cols-1 gap-8'>
				{hotelData?.map((hotel, index) => (
					<div
						className='flex flex-col justify-between gap-5 p-8 border rounded-lg border-slate-300'
						key={index}
					>
						<h2 className='text-2xl font-bold'> {hotel.name} </h2>
						<div className='whitespace-pre-line'>{hotel.description}</div>
						{/* hotel types and other thing */}
						<div className='grid grid-cols-5 gap-2'>
							<div className='flex items-center p-3 border rounded-sm border-slate-300'>
								<BsMap className='mr-1' />
								{hotel.city}, {hotel.country}
							</div>

							<div className='flex items-center p-3 border rounded-sm border-slate-300'>
								<BsBuilding className='mr-1' />
								{hotel.type}
							</div>

							<div className='flex items-center p-3 border rounded-sm border-slate-300'>
								<BiMoney className='mr-1' />${hotel.pricePerNight} per night
							</div>

							<div className='flex items-center p-3 border rounded-sm border-slate-300'>
								<BiHotel className='mr-1' />
								{hotel.adultCount} Adults, {hotel.childCount} Children
							</div>

							<div className='flex items-center p-3 border rounded-sm border-slate-300'>
								<BiStar className='mr-1' />
								{hotel.starRating} Star rating
							</div>
						</div>

						{/* view details link */}
						<span className='flex justify-end'>
							<Link
								className='flex p-2 text-xl font-bold text-white bg-blue-600 hover:bg-blue-500'
								to={`/edit-hotel/${hotel._id}`}
							>
								View Details
							</Link>
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default MyHotels;
