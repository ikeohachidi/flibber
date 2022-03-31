import React from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

import SideNav from 'components/SideNav/SideNav';
import ChatWindow from 'components/ChatWindow/ChatWindow';
import RecentChat from 'components/RecentChat/RecentChat';

import RoutePath from 'routes';
import User from 'types/User';
import { useActiveUser } from 'hooks/activeUser';
import { setUser } from 'store/user';

const Application = () => {
	const navigation = useNavigate();
	const dispatch = useDispatch();

	const activeUserMetadata = useActiveUser((activeUser, userMetadata) => {
		if (activeUser === null) {
			navigation(RoutePath.LOGIN);
			return;
		}

		dispatch(setUser( userMetadata ))
	});

	return (
		<div className="App grid grid-cols-8">
			<div className="col-span-2">
				<SideNav user={ activeUserMetadata as User }/>
			</div>
			<div className="col-span-2">
				<RecentChat user={ activeUserMetadata as User }/>
			</div>
			<div className="col-span-4">
				<ChatWindow />
			</div>
		</div>
	)
}

export default Application;