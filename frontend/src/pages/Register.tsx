import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import * as apiClient from '../api-client';

// ts validation types
export type RegisterFormData = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const Register = () => {
	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>();

	// react-query to fetch data
	const mutation = useMutation(apiClient.register, {
		onSuccess: () => {
			console.log('Registration successful');
		},
		onError: (error: Error) => {
			console.error('Registration failed', error);
		},
	});

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		mutation.mutate(data);
	});

	return (
		<form className='flex flex-col gap-5' onSubmit={onSubmit}>
			<h2 className='text-3xl font-bold'>Create an Account</h2>

			<div className='flex flex-col md:flex-row gap-5'>
				<label className='text-gray-700 text-sm font-bold flex-1'>
					First Name
					<input
						className='border rounded w-full py-1 px-2 font-normal'
						{...register('firstName', { required: 'this filed is Required' })}
					></input>
					{errors.firstName && (
						<span className='text-red-500 capitalize mt-1 block'>
							{errors?.firstName?.message}
						</span>
					)}
				</label>

				<label className='text-gray-700 text-sm font-bold flex-1'>
					Last Name
					<input
						type='text'
						className='border rounded w-full py-1 px-2 font-normal'
						{...register('lastName', { required: 'this filed is required' })}
					></input>
					{errors.lastName && (
						<span className='text-red-500 capitalize mt-1 block'>
							{errors?.lastName?.message}
						</span>
					)}
				</label>
			</div>

			<label className='text-gray-700 text-sm font-bold flex-1'>
				Email
				<input
					type='email'
					className='border rounded w-full py-1 px-2 font-normal'
					{...register('email', { required: 'this filed is required' })}
				></input>
				{errors.email && (
					<span className='text-red-500 block mt-1 capitalize'>
						{' '}
						{errors?.email?.message}{' '}
					</span>
				)}
			</label>

			<label className='text-gray-700 text-sm font-bold flex-1'>
				Password
				<input
					type='password'
					className='border rounded w-full py-1 px-2 font-normal'
					{...register('password', {
						required: 'this filed is required',
						minLength: {
							value: 6,
							message: 'password must be at least 6 characters',
						},
					})}
				></input>
				{errors.password && (
					<span className='text-red-500 block mt-1 capitalize'>
						{' '}
						{errors?.password?.message}{' '}
					</span>
				)}
			</label>

			<label className='text-gray-700 text-sm font-bold flex-1'>
				Confirm Password
				<input
					type='password'
					className='border rounded w-full py-1 px-2 font-normal'
					{...register('confirmPassword', {
						validate: (value) => {
							if (!value) {
								return 'This field is required';
							} else if (watch('password') !== value) {
								return 'Your password do not match!';
							}
						},
					})}
				></input>
				{errors.confirmPassword && (
					<span className='text-red-500 block mt-1 capitalize'>
						{' '}
						{errors?.confirmPassword?.message}{' '}
					</span>
				)}
			</label>

			<span>
				<button
					type='submit'
					className='bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl '
				>
					Create Account
				</button>
			</span>
		</form>
	);
};

export default Register;
