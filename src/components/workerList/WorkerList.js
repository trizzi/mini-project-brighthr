import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, addDays, parseISO } from 'date-fns';

const WorkerList = () => {
	const [workers, setWorkers] = useState([]);
	const [filteredWorkers, setFilteredWorkers] = useState([]);
	const [filters, setFilters] = useState({
		name: '',
		startDate: '',
		endDate: '',
		absenceType: '',
	});

	useEffect(() => {
		const fetchWorkers = async () => {
			try {
				const response = await fetch(
					'https://front-end-kata.brighthr.workers.dev/api/absences',
				);
				const data = await response.json();
				const absencesWithConflicts = await Promise.all(
					data.map(async (absence) => {
						const conflictResponse = await fetch(
							`https://front-end-kata.brighthr.workers.dev/api/conflict/${absence.id}`,
						);
						const conflictData = await conflictResponse.json();
						return { ...absence, hasConflict: conflictData.hasConflict };
					}),
				);
				setWorkers(absencesWithConflicts);
				setFilteredWorkers(absencesWithConflicts);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchWorkers();
	}, []);

	useEffect(() => {
		applyFilters();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters, workers]);

	const formatDate = (dateString) => {
		return format(new Date(dateString), 'dd-MM-yyyy');
	};

	const calculateEndDate = (startDate, days) => {
		const endDate = addDays(new Date(startDate), days);
		return format(endDate, 'dd-MM-yyyy');
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFilters({ ...filters, [name]: value });
	};

	const applyFilters = () => {
		let filtered = workers;

		if (filters.name) {
			filtered = filtered.filter((worker) =>
				`${worker.employee.firstName} ${worker.employee.lastName}`
					.toLowerCase()
					.includes(filters.name.toLowerCase()),
			);
		}

		if (filters.startDate) {
			filtered = filtered.filter(
				(worker) => parseISO(worker.startDate) >= parseISO(filters.startDate),
			);
		}

		if (filters.absenceType) {
			filtered = filtered.filter((worker) =>
				worker.absenceType
					.toLowerCase()
					.includes(filters.absenceType.toLowerCase()),
			);
		}

		setFilteredWorkers(filtered);
	};

	return (
		<div className='container mx-auto mt-4 p-4 sm:mt-10 sm:p-10'>
			<h1 className='text-xl font-bold mb-8 sm:text-2xl text-center'>
				Worker Absence List
			</h1>

			<div className='mb-6 flex flex-col sm:flex-row gap-4'>
				<input
					type='text'
					name='name'
					placeholder='Filter by name'
					value={filters.name}
					onChange={handleInputChange}
					className='p-2 border rounded flex-1'
				/>
				<input
					type='date'
					name='startDate'
					placeholder='Filter by start date'
					value={filters.startDate}
					onChange={handleInputChange}
					className='p-2 border rounded flex-1'
				/>

				<input
					type='text'
					name='absenceType'
					placeholder='Filter by absence type'
					value={filters.absenceType}
					onChange={handleInputChange}
					className='p-2 border rounded flex-1'
				/>
			</div>

			<div className='bg-white shadow-md rounded-lg p-4 sm:p-6 overflow-x-auto'>
				<table className='min-w-full text-sm sm:text-base'>
					<thead>
						<tr className='bg-blue-500 text-white'>
							<th className='px-2 sm:px-4 py-2 '>Name</th>
							<th className='px-2 sm:px-4 py-2 '>Start Date</th>
							<th className='px-2 sm:px-4 py-2 '>End Date</th>
							<th className='px-2 sm:px-4 py-2 '>Number of Days</th>
							<th className='px-2 sm:px-4 py-2 '>Absence Type</th>
							<th className='px-2 sm:px-4 py-2'>Approved</th>
							<th className='px-2 sm:px-4 py-2 '>Conflict</th>
						</tr>
					</thead>
					<tbody>
						{filteredWorkers.map((worker) => (
							<tr
								key={worker.id}
								className='border-t'>
								<td className='px-2 sm:px-4 py-2 text-center'>
									<Link
										to={`/worker/${worker.employee.id}`}
										className='text-blue-500 hover:underline'>
										{`${worker.employee.firstName} ${worker.employee.lastName}`}
									</Link>
								</td>
								<td className='px-2 sm:px-4 py-2 text-center'>
									{formatDate(worker.startDate)}
								</td>
								<td className='px-2 sm:px-4 py-2 text-center'>
									{calculateEndDate(worker.startDate, worker.days)}
								</td>
								<td className='px-2 sm:px-4 py-2 text-center'>{worker.days}</td>
								<td className='px-2 sm:px-4 py-2 text-center'>
									{worker.absenceType}
								</td>
								<td className='px-2 sm:px-4 py-2 text-center'>
									{worker.approved ? (
										<span className='text-green-500 font-bold'>Approved</span>
									) : (
										<span className='text-red-500 font-bold'>Pending</span>
									)}
								</td>
								<td className='px-2 sm:px-4 py-2 text-center'>
									{worker.hasConflict ? (
										<span className='text-red-500 font-bold'>Conflict</span>
									) : (
										<span className='text-green-500'>No Conflict</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default WorkerList;
