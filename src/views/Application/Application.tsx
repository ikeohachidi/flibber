import React from 'react';
import { useNavigate } from 'react-router';

import SideNav from 'components/SideNav/SideNav';
import Chat from 'components/Chat/Chat';
import Messages from 'components/Messages/Messages';

import RoutePath from 'routes';
import User from 'types/User';
import { useActiveUser } from 'hooks/activeUser';

const Application = () => {
	const navigation = useNavigate();

	const activeUserMetadata = useActiveUser((activeUser) => {
		if (activeUser === null) {
			navigation(RoutePath.LOGIN);
		}
	});

	return (
		<div className="App grid grid-cols-8">
			<div className="col-span-2">
				<SideNav user={ activeUserMetadata as User }/>
			</div>
			<div className="col-span-2">
				<Messages user={ activeUserMetadata as User }/>
			</div>
			<div className="col-span-4">
				<Chat user={ activeUserMetadata as User  }/>
			</div>
		</div>
	)
}

export default Application;