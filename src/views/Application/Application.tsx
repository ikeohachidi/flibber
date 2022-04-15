import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

import SideNav from 'components/SideNav/SideNav';
import ChatWindow from 'components/ChatWindow/ChatWindow';
import RecentChat from 'components/RecentChat/RecentChat';

import RoutePath from 'routes';
import User from 'types/User';
import { useActiveUser } from 'hooks/activeUser';
import { setUser } from 'store/user';
import { chatListener } from 'supabase/chat';
import { addMessageToConversation } from 'store/chat';
import Chat from 'types/Chat';
import { SupabaseRealtimePayload } from '@supabase/supabase-js';

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

	useEffect(() => {
		if (activeUserMetadata) {
			chatListener(activeUserMetadata?.id, (payload: SupabaseRealtimePayload<Chat>) => {
				dispatch(addMessageToConversation({ 
					authUserId: activeUserMetadata.id, 
					chat: payload.new
				}))
			})
		}
	}, [ activeUserMetadata ])

	return (
		<div className="App grid grid-cols-8">
			<div className="col-span-2">
				<SideNav user={ activeUserMetadata as User }/>
			</div>
			<div className="col-span-2">
				<RecentChat />
			</div>
			<div className="col-span-4">
				<ChatWindow />
			</div>
		</div>
	)
}

export default Application;