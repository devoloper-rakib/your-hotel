import { hotelFacilities } from '../config/hotel-options-config';

type Props = {
	selectedFacilities: string[];
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
	return (
		<div className='pb-5 border-b border-slate-300'>
			<h4 className='mb-2 font-semibold text-md'>Facilities</h4>
			{hotelFacilities.map((facilities, index) => (
				<label key={index} className='flex items-center space-x-2'>
					<input
						type='checkbox'
						className='rounded '
						value={facilities}
						checked={selectedFacilities.includes(facilities)}
						onChange={onChange}
					/>

					<span> {facilities} </span>
				</label>
			))}
		</div>
	);
};

export default FacilitiesFilter;
