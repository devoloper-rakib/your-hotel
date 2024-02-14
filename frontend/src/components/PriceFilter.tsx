type Props = {
	selectedPrice?: number;
	onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
	return (
		<div>
			<h4 className='mb-2 font-semibold text-md'>Max Price</h4>

			<select
				className='w-full p-2 border rounded-md '
				value={selectedPrice}
				onChange={(event) =>
					onChange(
						event.target.value ? parseInt(event.target.value) : undefined,
					)
				}
			>
				<option value=''>Select Max Price</option>
				{[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
					(price, index) => (
						<option key={index} value={price}>
							{price}
						</option>
					),
				)}
			</select>
		</div>
	);
};

export default PriceFilter;
