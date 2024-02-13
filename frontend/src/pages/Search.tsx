import { useQuery } from 'react-query';
import { useSearchContext } from '../contexts/SearchContext';
import * as apiClient from './../api-client';
import { useState } from 'react';
import SearchResultsCard from '../components/SearchResultsCard';

const Search = () => {
	const search = useSearchContext();
	const [page, setPage] = useState<number>(1);

	const searchParams = {
		destination: search.destination,
		checkIn: search.checkIn.toISOString(),
		checkOut: search.checkOut.toISOString(),
		adultCount: search.adultCount.toString(),
		childCount: search.childCount.toString(),
		page: page.toString(),
	};

	const { data: hotelData } = useQuery(['searchHotels', searchParams], () =>
		apiClient.searchHotels(searchParams),
	);

	return (
		<div className='grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5'>
			<div className='sticky p-5 border rounded-lg border-slate-300 h-fit top-10'>
				<div className='space-y-5'>
					<h3 className='pb-5 text-lg font-semibold border-b border-slate-300'>
						Filter By
					</h3>
					{/* // Todo : Filters data will be added near future  */}
				</div>
			</div>

			<div className='flex flex-col gap-5'>
				<div className='flex items-center justify-between'>
					<span className='text-xl font-bold'>
						{hotelData?.pagination.total} Hotels found
						{search.destination ? ` in ${search.destination}` : ''}
					</span>
					{/* // todo: sort option will be added near future */}
				</div>
				{hotelData?.data.map((hotel) => (
					<SearchResultsCard hotel={hotel} />
				))}
			</div>
		</div>
	);
};

export default Search;
