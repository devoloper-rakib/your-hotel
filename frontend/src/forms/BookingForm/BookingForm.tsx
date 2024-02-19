import { useForm } from 'react-hook-form';
import { UserType } from '../../../../backend/src/shared/types';

type Props = {
	currentUser: UserType;
};

type BookingFormData = {
	firstName: string;
	lastName: string;
	email: string;
};

const BookingForm = ({ currentUser }: Props) => {
	const { register, handleSubmit } = useForm<BookingFormData>({
		defaultValues: {
			firstName: currentUser.firstName,
			lastName: currentUser.lastName,
			email: currentUser.email,
		},
	});

	return (
		<form className='grid grid-cols-1 gap-5 p-5 border rounded-lg border-slate-300 '>
			<span className='text-3xl font-bold'>Confirm Your Details </span>

			<div className='grid grid-cols-2 gap-6'>
				<label className='flex-1 text-sm font-bold text-gray-700 '>
					First Name
					<input
						type='text'
						readOnly
						disabled
						{...register('firstName')}
						className='w-full px-3 py-2 mt-1 font-normal text-gray-700 bg-gray-200 border rounded'
					/>
				</label>

				<label className='flex-1 text-sm font-bold text-gray-700 '>
					Last Name
					<input
						type='text'
						readOnly
						disabled
						{...register('lastName')}
						className='w-full px-3 py-2 mt-1 font-normal text-gray-700 bg-gray-200 border rounded'
					/>
				</label>

				<label className='flex-1 text-sm font-bold text-gray-700 '>
					Email
					<input
						type='email'
						readOnly
						disabled
						{...register('email')}
						className='w-full px-3 py-2 mt-1 font-normal text-gray-700 bg-gray-200 border rounded'
					/>
				</label>
			</div>
		</form>
	);
};

export default BookingForm;
