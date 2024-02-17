import { useQuery } from 'react-query';
import * as apiClient from '../api-client';

const Booking = () => {
	const { data: currentUser } = useQuery(
		'fetchCurrentUser',
		apiClient.fetchCurrentUser,
	);

	console.log(currentUser?.email);

	return <></>;
};

export default Booking;
