import { useMutation } from 'react-query';

import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';

const SignOutButton = () => {
	const { showToast } = useAppContext();

	const mutation = useMutation(apiClient.signOut, {
		onSuccess: () => {
			showToast({ message: 'Sign Out Successfully', type: 'SUCCESS' });
		},

		onError: (error: Error) => {
			showToast({ message: error.message, type: 'ERROR' });
		},
	});

	const handleClick = () => {
		mutation.mutate();
	};

	return (
		<button
			onClick={handleClick}
			className='text-blue-600 px-3 font-bold hover:bg-gray-100 bg-white '
		>
			Sign Out
		</button>
	);
};

export default SignOutButton;
