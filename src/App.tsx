import { Routes, Route } from "react-router-dom";

import './App.css';

import Application from 'views/Application/Application';
import Signup from "views/Signup/Signup";
import Login from "views/Login/Login";

import RoutePath from 'routes';

function App() {
	return (
		<Routes>
			<Route path={ RoutePath.APP } element={ <Application/> } />
			<Route path={ RoutePath.SIGNUP } element={ <Signup/> } />
			<Route path={ RoutePath.LOGIN } element={ <Login/> } />
		</Routes>
	);
}

export default App;
