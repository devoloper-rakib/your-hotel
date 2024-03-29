import { FormProvider, useForm } from 'react-hook-form';
import { useEffect } from 'react';

import DetailsSection from './DetailsSection';
import TypeSection from './TypeSection';
import FacilitiesSection from './FacilitiesSection';
import GuestsSection from './GuestsSection';
import ImagesSection from './ImagesSection';
import { HotelType } from '../../../../backend/src/shared/types';

export type HotelFormData = {
	name: string;
	city: string;
	country: string;
	description: string;
	type: string;
	pricePerNight: number;
	starRating: number;
	facilities: string[];
	imageFiles: FileList;
	imageUrls: string[];
	adultCount: number;
	childCount: number;
};

type Props = {
	hotel?: HotelType; /// defined as optional property
	onSave: (hotelFormData: FormData) => void;
	isLoading: boolean;
};

function ManageHotelForm({ onSave, isLoading, hotel }: Props) {
	const formMethods = useForm<HotelFormData>();

	const { handleSubmit, reset } = formMethods;

	useEffect(() => {
		reset(hotel);
	}, [hotel, reset]);

	const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
		// Point : create new formData object & call our API
		const formData = new FormData();

		if (hotel) formData.append('hotelId', hotel._id);

		formData.append('name', formDataJson.name);
		formData.append('city', formDataJson.city);
		formData.append('country', formDataJson.country);
		formData.append('description', formDataJson.description);
		formData.append('type', formDataJson.type);
		formData.append('pricePerNight', formDataJson.pricePerNight.toString());
		formData.append('starRating', formDataJson.starRating.toString());
		formData.append('adultCount', formDataJson.adultCount.toString());
		formData.append('childCount', formDataJson.childCount.toString());

		formDataJson.facilities.forEach((facility, index) => {
			formData.append(`facilities[${index}]`, facility);
		});

		if (formDataJson.imageUrls) {
			formDataJson.imageUrls.forEach((url, index) => {
				formData.append(`imageUrls[${index}]`, url);
			});
		}

		Array.from(formDataJson.imageFiles).forEach((imageFile) => {
			formData.append(`imageFiles`, imageFile);
		});

		console.log(formData);
		onSave(formData);
	});

	return (
		<FormProvider {...formMethods}>
			<form className='flex flex-col gap-10' onSubmit={onSubmit}>
				<DetailsSection />
				<TypeSection />
				<FacilitiesSection />
				<GuestsSection />
				<ImagesSection />
				<span className='flex justify-end'>
					<button
						disabled={isLoading}
						type='submit'
						className='p-2 text-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500'
					>
						{isLoading
							? hotel
								? 'Updating...'
								: 'Adding...'
							: hotel
							? 'Update Hotel'
							: 'Add Hotel'}
					</button>
				</span>
			</form>
		</FormProvider>
	);
}

export default ManageHotelForm;
