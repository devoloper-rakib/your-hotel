import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import LatestDestinationCard from '../components/LatestDestinationCard';

const Home = () => {
	const { data: hotels } = useQuery('fetchQuery', () =>
		apiClient.fetchHotels(),
	);

	const topRowHotels = hotels?.slice(0, 2) || [];
	const bottomRowHotels = hotels?.slice(2) || [];

	return (
		<div className='space-y-3'>
			<h2 className='text-3xl font-bold'>Latest Destinations</h2>

			<p>Most recent destinations added by our hosts/users</p>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				{topRowHotels.map((hotel, index) => (
					<LatestDestinationCard hotel={hotel} key={index + 1} />
				))}
			</div>
			<div className='grid gap-4 md:grid-cols-3'>
				{bottomRowHotels.map((hotel, index) => (
					<LatestDestinationCard hotel={hotel} key={index + 1} />
				))}
			</div>
		</div>
	);
};

export default Home;
