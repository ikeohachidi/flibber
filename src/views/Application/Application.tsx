import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import SideNav from 'components/SideNav/SideNav';
import Chat from 'components/Chat/Chat';
import Messages from 'components/Messages/Messages';

import { authentictedUser } from 'services/authentication';
import RoutePath from 'routes';

const Application = () => {
	const navigation = useNavigate();
	const loggedInUser = authentictedUser();

	useEffect(() => {
		if (loggedInUser === null) {
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