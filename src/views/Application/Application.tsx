import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import SideNav from 'components/SideNav/SideNav';
import ChatWindow from 'components/ChatWindow/ChatWindow';
import RecentChat from 'components/RecentChat/RecentChat';

import RoutePath from 'routes';
import User from 'types/User';
import { useActiveUser } from 'hooks/activeUser';
import { setUser } from 'store/user';
import { chatListener } from 'supabase/chat';
import { addMessageToConversation, setRecentConversation } from 'store/chat';
import Chat from 'types/Chat';
import { SupabaseRealtimePayload } from '@supabase/supabase-js';
import { AppState } from 'store';

const Application = () => {
	const navigation = useNavigate();
	const dispatch = useDispatch();

	const users = useSelector<AppState, User[]>(state => state.contacts.acceptedContacts);

	const activeUserMetadata = useActiveUser((activeUser, userMetadata) => {
		if (activeUser === null) {
			navigation(RoutePath.LOGIN);
			return;
		}

		dispatch(setUser( userMetadata ))
	});

	const findUser = (from: number) => {
		return users.find(user => user.id === from);
	}

	let chatInitialised = false;

	useEffect(() => {
		if (activeUserMetadata && users.length > 0 && !chatInitialised) {
			chatListener(activeUserMetadata?.id, (payload: SupabaseRealtimePayload<Chat>) => {
				const { from } = payload.new;
				const fromUser = findUser(from)

				if (fromUser) {
					dispatch(setRecentConversation({
						authUserId: activeUserMetadata.id,
						conversation: {
							message: payload.new.message,
							created_at: payload.new.created_at as string,
							from: fromUser,
							to: activeUserMetadata,
						}
					}))
				}

				dispatch(addMessageToConversation({ 
					authUserId: activeUserMetadata.id, 
					chat: payload.new
				}))
			})
			.then(() => {
				chatInitialised = true;
			})
		}
	}, [ activeUserMetadata, users ])

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