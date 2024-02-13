import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import * as apiClient from '../api-client';
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm';
import { useAppContext } from '../contexts/AppContext';

const EditHotel = () => {
	const { hotelId } = useParams();
	const { showToast } = useAppContext();

	const { data: hotel } = useQuery(
		'fetchMyHotelById',
		() => apiClient.fetchMyHotelById(hotelId || ''),
		{
			enabled: !!hotelId, // only going to work if hotel id is enabled
		},
	);

	const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
		onSuccess: () => {
			showToast({ message: 'Hotel Updated Successfully', type: 'SUCCESS' });
		},
		onError: (err) => {
			showToast({ message: 'Error adding to the list', type: 'ERROR' });
			console.log(err);
		},
	}); 

	const handleSave = (hotelFormData: FormData) => {
		mutate(hotelFormData);
	};

	return (
		<ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
	);
};

export default EditHotel;
