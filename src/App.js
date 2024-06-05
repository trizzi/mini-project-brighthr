import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navigation/Navbar';
import WorkerList from './components/workerList/WorkerList';
import WorkerDetails from './components/workerDetails/WorkerDetails';

import './App.css';

function App() {
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route
						path='/'
						element={
							<>
								<Navbar />
								<WorkerList />
							</>
						}
					/>
					<Route
						path='/worker/:id'
						element={
							<>
								<Navbar />
								<WorkerDetails />
							</>
						}
					/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
