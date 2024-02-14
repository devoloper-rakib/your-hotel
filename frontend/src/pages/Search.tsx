import { useQuery } from 'react-query';
import { useSearchContext } from '../contexts/SearchContext';
import * as apiClient from './../api-client';
import React, { useState } from 'react';
import SearchResultsCard from '../components/SearchResultsCard';
import Pagination from '../components/Pagination';
import StarRatingFilter from '../components/StarRatingFilter';
import HotelTypesFilter from '../components/HotelTypesFilter';
import FacilitiesFilter from '../components/FacilitiesFilter';
import PriceFilter from '../components/PriceFilter';

const Search = () => {
	const search = useSearchContext();
	const [page, setPage] = useState<number>(1);
	const [selectedStars, setSelectedStars] = useState<string[]>([]);
	const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
	const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
	const [selectedPrice, setSelectedPrice] = useState<number | undefined>();

	const searchParams = {
		destination: search.destination,
		checkIn: search.checkIn.toISOString(),
		checkOut: search.checkOut.toISOString(),
		adultCount: search.adultCount.toString(),
		childCount: search.childCount.toString(),
		page: page?.toString(),

		stars: selectedStars,
		types: selectedHotelTypes,
		facilities: selectedFacilities,
		maxPrice: selectedPrice?.toString(),
	};

	const { data: hotelData } = useQuery(['searchHotels', searchParams], () =>
		apiClient.searchHotels(searchParams),
	);

	const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const starRating = event.target.value;

		setSelectedStars((prevStars) =>
			event.target.checked
				? [...prevStars, starRating]
				: prevStars.filter((star) => star !== starRating),
		);
	};

	const handleHotelTypes = (event: React.ChangeEvent<HTMLInputElement>) => {
		const hotelTypeValue = event.target.value;

		setSelectedHotelTypes((prevHotelType) =>
			event.target.checked
				? [...prevHotelType, hotelTypeValue]
				: prevHotelType.filter((hotelType) => hotelType !== hotelTypeValue),
		);
	};

	const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const facilities = event.target.value;

		setSelectedFacilities((prevFacilities) =>
			event.target.checked
				? [...prevFacilities, facilities]
				: prevFacilities.filter((facility) => facility !== facilities),
		);
	};

	return (
		<div className='grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5'>
			<div className='sticky p-5 border rounded-lg border-slate-300 h-fit top-10'>
				<div className='space-y-5'>
					<h3 className='pb-5 text-lg font-semibold border-b border-slate-300'>
						Filter By
					</h3>
					<StarRatingFilter
						selectedStars={selectedStars}
						onChange={handleStarsChange}
					/>

					<HotelTypesFilter
						onChange={handleHotelTypes}
						selectedHotelTypes={selectedHotelTypes}
					/>

					<FacilitiesFilter
						onChange={handleFacilityChange}
						selectedFacilities={selectedFacilities}
					/>

					<PriceFilter
						selectedPrice={selectedPrice}
						onChange={(value?: number) => setSelectedPrice(value)}
					/>
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
				{hotelData?.data.map((hotel, index) => (
					<SearchResultsCard key={index} hotel={hotel} />
				))}
				<div>
					<Pagination
						page={hotelData?.pagination.page || 1}
						pages={hotelData?.pagination.pages || 1}
						onPageChange={(page) => setPage(page)}
					/>
				</div>
			</div>
		</div>
	);
};

export default Search;
