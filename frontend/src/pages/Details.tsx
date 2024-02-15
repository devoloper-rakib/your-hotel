import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';

import * as apiClient from '../api-client';
const Details = () => {
	const { hotelId } = useParams();

	const { data: hotel } = useQuery(
		'fetchHotelById',
		() => apiClient.fetchHotelById(hotelId || ''),
		{ enabled: !!hotelId },
	);

	if (!hotel) {
		return <></>;
	}

	return (
		<div className='space-y-6 '>
			<div>
				<span className='flex '>
					{Array.from({ length: hotel.starRating }).map((_, index) => (
						<AiFillStar key={index} className='fill-yellow-400' />
					))}
				</span>
				<h1 className='text-3xl font-bold'>{hotel.name}</h1>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
				{hotel.imageUrls.map((image, index) => (
					<div className='h-[300px]' key={index}>
						<img
							src={image}
							alt={hotel.name}
							className='rounded-md w-full h-full object-cover object-center'
						/>
					</div>
				))}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-4 gap-2'>
				{hotel.facilities.map((facility, index) => (
					<div key={index} className='border border-slate-300 rounded-sm p-3'>
						{facility}
					</div>
				))}
			</div>
		</div>
	);
};

export default Details;
