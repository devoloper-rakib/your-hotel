import { hotelTypes } from '../config/hotel-options-config';

type Props = {
	selectedHotelTypes: string[];
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const HotelTypesFilter = ({ selectedHotelTypes, onChange }: Props) => {
	return (
		<div className='pb-5 border-b border-slate-300'>
			<h4 className='mb-2 font-semibold text-md'>Hotel Types</h4>
			{hotelTypes.map((hotelType, index) => (
				<label key={index} className='flex items-center space-x-2'>
					<input
						type='checkbox'
						className='rounded '
						value={hotelType}
						checked={selectedHotelTypes.includes(hotelType)}
						onChange={onChange}
					/>

					<span> {hotelType} </span>
				</label>
			))}
		</div>
	);
};

export default HotelTypesFilter;
