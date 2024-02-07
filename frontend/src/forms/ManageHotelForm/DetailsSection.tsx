import { useFormContext } from 'react-hook-form';
import { HotelFormData } from './ManageHotelForm';

const DetailsSection = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<HotelFormData>();

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='mb-3 text-3xl font-bold'>Add Hotel</h1>

			<label className='flex-1 text-sm font-bold text-gray-700'>
				Name
				<input
					type='text'
					className='w-full px-2 py-1 font-normal border rounded'
					{...register('name', { required: 'This filed is required' })}
				/>
				{errors.name && (
					<span className='text-red-500'> {errors.name.message} </span>
				)}
			</label>

			<div className='flex gap-4'>
				<label className='flex-1 text-sm font-bold text-gray-700'>
					City
					<input
						type='text'
						className='w-full px-2 py-1 font-normal border rounded'
						{...register('city', { required: 'This filed is required' })}
					/>
					{errors.city && (
						<span className='text-red-500'> {errors.city.message} </span>
					)}
				</label>

				<label className='flex-1 text-sm font-bold text-gray-700'>
					Country
					<input
						type='text'
						className='w-full px-2 py-1 font-normal border rounded'
						{...register('country', { required: 'This filed is required' })}
					/>
					{errors.country && (
						<span className='text-red-500'> {errors.country.message} </span>
					)}
				</label>
			</div>

			<label className='flex-1 text-sm font-bold text-gray-700'>
				Description
				<textarea
					rows={10}
					className='w-full px-2 py-1 font-normal border rounded'
					{...register('description', { required: 'This filed is required' })}
				></textarea>
				{errors.description && (
					<span className='text-red-500'> {errors.description.message} </span>
				)}
			</label>

			{/* // Todo : I  will complete this section to added price per night and star rating with a parent div to join this side by side  */}
			<label className='text-gray-700 text-sm font-bold max-w-[50%]'>
				Price Per Night
				<input
					type='number'
					min={1}
					className='w-full px-2 py-1 font-normal border rounded'
					{...register('pricePerNight', { required: 'This filed is required' })}
				/>
				{errors.pricePerNight && (
					<span className='text-red-500'> {errors.pricePerNight.message} </span>
				)}
			</label>

			<label className='text-gray-700 text-sm font-bold max-w-[50%]'>
				Star Rating
				<select
					{...register('starRating', {
						required: 'This filed is required',
					})}
					className='w-full p-2 font-normal text-gray-700 border rounded'
				>
					<option value='' className='text-sm font-bold '>
						Select as Rating
					</option>
					{[1, 2, 3, 4, 5].map((num) => (
						<option key={num} value={num}>
							{num}
						</option>
					))}
				</select>
				{errors.city && (
					<span className='text-red-500'> {errors.city.message} </span>
				)}
			</label>

			{/* // TODO :   I  will complete this section to added price per night and star rating with a parent div to join this side by side  */}
		</div>
	);
};

export default DetailsSection;
