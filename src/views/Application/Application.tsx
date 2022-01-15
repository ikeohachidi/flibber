import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import SideNav from 'components/SideNav/SideNav';
import Chat from 'components/Chat/Chat';
import Messages from 'components/Messages/Messages';

import { authentictedUser } from 'supabase/authentication';
import RoutePath from 'routes';
import User, { UserSession } from 'types/User';
import { getUser } from 'supabase/user';

const Application = () => {
	const navigation = useNavigate();
	const activeUser = authentictedUser() as UserSession;
	let [ activeUserMetadata, setActiveUserMetadata ] = useState<User>()

	useEffect(() => {
		if (activeUser === null) {
			navigation(RoutePath.LOGIN);
		}

		getUser({ email: activeUser.email }, 'email')
			.then(({ data, error }) => {
				if (error) return;
				setActiveUserMetadata(data!)
			})
	})

	return (
		<div className="App grid grid-cols-8">
			<div className="col-span-2">
				<SideNav session={ activeUser } user={ activeUserMetadata as User }/>
			</div>
			<div className="col-span-2">
				<Messages user={ activeUser }/>
			</div>
			<div className="col-span-4">
				<Chat user={ activeUser }/>
			</div>
		</div>
	)
}

export default Application;