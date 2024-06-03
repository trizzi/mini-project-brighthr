import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
						element={<WorkerList />}
					/>
					<Route
						path='/worker/:id'
						element={<WorkerDetails />}
					/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
