import { FormEvent, useState } from 'react';
import { MdTravelExplore } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useSearchContext } from '../contexts/SearchContext';

const SearchBar = () => {
	const search = useSearchContext();

	const [destination, setDestination] = useState<string>(search.destination);
	const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
	const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
	const [adultCount, setAdultCount] = useState<number>(search.adultCount);
	const [childCount, setChildCount] = useState<number>(search.childCount);

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		search.saveSearchValues(
			destination,
			checkIn,
			checkOut,
			adultCount,
			childCount,
		);
	};

	const minDate = new Date();
	const maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() + 1);

	return (
		<form
			onSubmit={handleSubmit}
			className='grid items-center grid-cols-2 gap-4 p-3 -mt-8 bg-orange-400 rounded shadow-md lg:grid-cols-3 2xl:grid-cols-5'
		>
			<div className='flex flex-row items-center flex-1 p-3 bg-white '>
				<MdTravelExplore size={25} className='mr-2' />
				<input
					type='text'
					placeholder='Where are you going?'
					className='w-full text-md'
					value={destination}
					onChange={(event) => setDestination(event.target.value)}
				/>
			</div>
			<div className='flex gap-2 px-2 py-1 bg-white rounded'>
				<label className='flex items-center'>
					Adults:
					<input
						type='number'
						min={1}
						max={20}
						className='w-full p-1 font-bold rounded'
						value={adultCount}
						onChange={(event) => setAdultCount(parseInt(event.target.value))}
					/>
				</label>
				<label className='flex items-center'>
					Children:
					<input
						type='number'
						min={0}
						max={20}
						className='w-full p-1 font-bold'
						value={childCount}
						onChange={(event) => setChildCount(parseInt(event.target.value))}
					/>
				</label>
			</div>

			<div>
				<DatePicker
					selected={checkIn}
					onChange={(date) => setCheckIn(date as Date)}
					selectsStart
					startDate={checkIn}
					endDate={checkOut}
					minDate={minDate}
					maxDate={maxDate}
					placeholderText='Check-in Date'
					className='min-w-full p-2 bg-white'
					wrapperClassName='min-w-full'
				/>
			</div>

			<div>
				<DatePicker
					selected={checkOut}
					onChange={(date) => setCheckOut(date as Date)}
					selectsStart
					startDate={checkIn}
					endDate={checkOut}
					minDate={minDate}
					maxDate={maxDate}
					placeholderText='Check-in Date'
					className='min-w-full p-2 bg-white'
					wrapperClassName='min-w-full'
				/>
			</div>

			<div className='flex gap-1 '>
				<button className='w-2/3 h-full p-2 text-xl font-bold text-white bg-blue-600 hover:bg-blue-500'>
					Search
				</button>

				<button className='w-1/3 h-full p-2 text-xl font-bold text-white bg-red-600 hover:bg-red-500'>
					Clear
				</button>
			</div>
		</form>
	);
};

export default SearchBar;
