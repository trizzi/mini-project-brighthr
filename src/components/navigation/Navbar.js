import React from 'react';
import Logo from '../../assests/brighthrLogo-2.svg';

const Navbar = () => {
	return (
		<div className='flex justify-start items-center min-h-0 relative shadow-md mx-auto px-8'>
			<div className='w-48 p-4 sm:p-6'>
				<img
					src={Logo}
					alt='brightHr-Logo'
					className='w-48 p-2 text-blue-500'
				/>
			</div>

			{/* <div className=''>
				<h1 className='text-xl font-bold mb-4 sm:text-2xl'>
					Workers Absence List
				</h1>
			</div> */}
		</div>
	);
};

export default Navbar;
