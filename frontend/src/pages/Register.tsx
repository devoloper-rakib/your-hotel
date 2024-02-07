import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

// ts validation types
export type RegisterFormData = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const Register = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { showToast } = useAppContext();

	// handle registration
	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>();

	// react-query to fetch data
	const mutation = useMutation(apiClient.register, {
		onSuccess: async () => {
			await queryClient.invalidateQueries('validateToken');
			// console.log('Registration successful');
			showToast({ message: 'Registration successful', type: 'SUCCESS' });
			navigate('/'); // todo : after adding login form  will make  /login
		},
		onError: (error: Error) => {
			// console.error('Registration failed', error);
			showToast({ message: error.message, type: 'ERROR' });
		},
	});

	const onSubmit = handleSubmit((data) => {
		// console.log(data);
		mutation.mutate(data);
	});

	return (
		<form className='flex flex-col gap-5' onSubmit={onSubmit}>
			<h2 className='text-3xl font-bold'>Create an Account</h2>

			<div className='flex flex-col gap-5 md:flex-row'>
				<label className='flex-1 text-sm font-bold text-gray-700'>
					First Name
					<input
						// value='test' // for test purposes only
						className='w-full px-2 py-1 font-normal border rounded'
						{...register('firstName', { required: 'this filed is Required' })}
					></input>
					{errors.firstName && (
						<span className='block mt-1 text-red-500 capitalize'>
							{errors?.firstName?.message}
						</span>
					)}
				</label>

				<label className='flex-1 text-sm font-bold text-gray-700'>
					Last Name
					<input
						// value='test' // for test purposes only
						type='text'
						className='w-full px-2 py-1 font-normal border rounded'
						{...register('lastName', { required: 'this filed is required' })}
					></input>
					{errors.lastName && (
						<span className='block mt-1 text-red-500 capitalize'>
							{errors?.lastName?.message}
						</span>
					)}
				</label>
			</div>

			<label className='flex-1 text-sm font-bold text-gray-700'>
				Email
				<input
					// value='test@gmail.com' // for test purposes only
					type='email'
					className='w-full px-2 py-1 font-normal border rounded'
					{...register('email', { required: 'this filed is required' })}
				></input>
				{errors.email && (
					<span className='block mt-1 text-red-500 capitalize'>
						{' '}
						{errors?.email?.message}{' '}
					</span>
				)}
			</label>

			<label className='flex-1 text-sm font-bold text-gray-700'>
				Password
				<input
					// value='test123' // for test purposes only
					type='password'
					className='w-full px-2 py-1 font-normal border rounded'
					{...register('password', {
						required: 'this filed is required',
						minLength: {
							value: 6,
							message: 'password must be at least 6 characters',
						},
					})}
				></input>
				{errors.password && (
					<span className='block mt-1 text-red-500 capitalize'>
						{' '}
						{errors?.password?.message}{' '}
					</span>
				)}
			</label>

			<label className='flex-1 text-sm font-bold text-gray-700'>
				Confirm Password
				<input
					// value='test123' // for test purposes only
					type='password'
					className='w-full px-2 py-1 font-normal border rounded'
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
					<span className='block mt-1 text-red-500 capitalize'>
						{' '}
						{errors?.confirmPassword?.message}{' '}
					</span>
				)}
			</label>

			<span>
				<button
					type='submit'
					className='p-2 text-xl font-bold text-white bg-blue-600 hover:bg-blue-500 '
				>
					Create Account
				</button>
			</span>
		</form>
	);
};

export default Register;
