import React from 'react';

import './App.css';

import SideNav from './components/SideNav/SideNav';
import Chat from 'components/Chat/Chat';
import ChatDetails from 'components/ChatDetails/ChatDetails';

function App() {
	return (
		<div className="App grid grid-cols-8">
			<div className="col-span-2">
				<SideNav/>
			</div>
			<div className="col-span-4">
				<Chat/>
			</div>
			<div className="col-span-2">
				<ChatDetails/>
			</div>
		</div>
	);
}

export default App;
