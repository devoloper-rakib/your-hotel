import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
export type SignInFormData = {
	email: string;
	password: string;
};

const SignIn = () => {
	const queryClient = useQueryClient();

	const { showToast } = useAppContext();

	const navigate = useNavigate();
	const location = useLocation();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<SignInFormData>();

	const mutation = useMutation(apiClient.signIn, {
		onSuccess: async () => {
			// console.log('user has been signed In successfully!');
			await queryClient.invalidateQueries('validateToken');
			// 1. Show a toast message
			showToast({
				message: 'User has been signed In successfully',
				type: 'SUCCESS',
			});
			// 2. navigate to the home page
			navigate(location.state?.from?.pathname || '/');
		},
		onError: (error: Error) => {
			// show a toast message
			showToast({ message: error.message, type: 'ERROR' });
		},
	});

	const onSubmit = handleSubmit((data) => {
		mutation.mutate(data);
	});

	return (
		<form className='flex flex-col gap-5' onSubmit={onSubmit}>
			<h2 className='text-3xl font-bold'>Sign In</h2>

			<label className='flex-1 text-sm font-bold text-gray-700'>
				Email
				<input
					value='test@gmail.com' // for test purposes only
					type='email'
					className='w-full px-2 py-1 font-normal border rounded'
					{...register('email', { required: 'this filed is required' })}
				></input>
				{errors.email && (
					<span className='block mt-1 text-red-500 capitalize'>
						{errors?.email?.message}
					</span>
				)}
			</label>

			<label className='flex-1 text-sm font-bold text-gray-700'>
				Password
				<input
					value='test123' // for test purposes only
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
			<span className='flex items-center justify-between'>
				<span className='text-sm '>
					Not Registered?{' '}
					<Link className='underline ' to='/register'>
						{' '}
						Create an account
					</Link>
				</span>

				<button
					type='submit'
					className='p-2 text-xl font-bold text-white bg-blue-600 hover:bg-blue-500 '
				>
					Login
				</button>
			</span>
		</form>
	);
};

export default SignIn;
