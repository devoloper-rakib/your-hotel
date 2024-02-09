import { useFormContext } from 'react-hook-form';
import { HotelFormData } from './ManageHotelForm';

const ImagesSection = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<HotelFormData>();

	return (
		<div>
			<h2 className='mb-3 text-2xl font-bold'>Images</h2>

			<div className='flex flex-col gap-4 p-4 border rounded'>
				<input
					type='file'
					multiple
					accept='image/*'
					className='w-full font-normal text-gray -700'
					{...register('imageFiles', {
						validate: (imageFiles) => {
							const totalLength = imageFiles.length;

							if (totalLength === 0) {
								return 'At least one image file must be added';
							}
							if (totalLength > 6) {
								return 'Total number of images cannot exceed 6 images';
							}

							return true;
						},
					})}
				/>
			</div>
			{errors.imageFiles && (
				<span className='text-sm text-red-500 font-fold'>
					{errors.imageFiles.message}
				</span>
			)}
		</div>
	);
};

export default ImagesSection;
