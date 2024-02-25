import { Link } from 'react-router-dom';

import { HotelType } from '../../../backend/src/shared/types';

type Props = {
	hotel: HotelType;
};

const LatestDestinationCard = ({ hotel }: Props) => {
	return (
		<Link
			to={`/details/${hotel?._id}`}
			className='relative overflow-hidden rounded-md cursor-pointer'
		>
			<div className='h-[300px]'>
				<img src={hotel.imageUrls[0]} alt={hotel.name} />
			</div>
			<div className='absolute bottom-0 w-full p-4 bg-black bg-opacity-50 rounded-b-md'>
				<span className='text-3xl font-bold tracking-tight text-white '>
					{hotel.name}
				</span>
			</div>
		</Link>
	);
};

export default LatestDestinationCard;
