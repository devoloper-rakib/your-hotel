import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import SignOutButton from './SignOutButton';

const Header = () => {
	const { isLoggedIn } = useAppContext();

	return (
		<div className='bg-blue-800  py-6 pb-[3.5rem]'>
			<div className='container flex justify-between mx-auto '>
				<span className='text-3xl font-bold tracking-tight text-white'>
					<Link to='/'>Your-Hotel</Link>
				</span>

				<span className='flex space-x-2 '>
					{isLoggedIn ? (
						<>
							<Link
								className='flex items-center px-3 font-bold text-white hover:bg-blue-600'
								to='/my-bookings'
							>
								My Bookings
							</Link>
							<Link
								className='flex items-center px-3 font-bold text-white hover:bg-blue-600'
								to='/my-hotels'
							>
								My Hotels
							</Link>
							<SignOutButton />
						</>
					) : (
						<Link
							to='/sign-in'
							className='flex items-center px-3 font-bold text-blue-600 bg-white hover:bg-gray-100 '
						>
							Sign In
						</Link>
					)}
				</span>
			</div>
		</div>
	);
};

export default Header;
