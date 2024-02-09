import { useMutation } from 'react-query';
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm';
import { useAppContext } from '../contexts/AppContext';
import * as apiClient from '../api-client';

const AddHotel = () => {
	const { showToast } = useAppContext();

	const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
		onSuccess: () => {
			showToast({ message: 'Hotel added successfully', type: 'SUCCESS' });
		},

		onError: (err) => {
			showToast({ message: 'Error adding to the list', type: 'ERROR' });
			console.log(err);
		},
	});

	const handleSave = (hotelFormData: FormData) => {
		console.log('Hotel Saving ', hotelFormData);
		mutate(hotelFormData);
	};

	return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;
