import { Routes, Route } from "react-router-dom";

import './App.css';

import Application from 'views/Application/Application';
import Signup from "views/Signup/Signup";
import Login from "views/Login/Login";

function App() {
	return (
		<Routes>
			<Route path="/" element={ <Application/> } />
			<Route path="/signup" element={ <Signup/> } />
			<Route path="/login" element={ <Login/> } />
		</Routes>
	);
}

export default App;
