import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import SideNav from 'components/SideNav/SideNav';
import Chat from 'components/Chat/Chat';
import Messages from 'components/Messages/Messages';

import { activeUser } from 'services/authentication';
import RoutePath from 'routes';

const Application = () => {
	const navigation = useNavigate();

	useEffect(() => {
		if (activeUser() === null) {
			navigation(RoutePath.LOGIN);
		}
	})

	return (
		<div className="App grid grid-cols-8">
			<div className="col-span-2">
				<SideNav/>
			</div>
			<div className="col-span-2">
				<Messages />
			</div>
			<div className="col-span-4">
				<Chat/>
			</div>
		</div>
	)
}

export default Application;