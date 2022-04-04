import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './RecentChat.css';

import Avatar from 'components/Avatar/Avatar';

import { timeFromNow } from 'utils/date';
import { getRecentConversations } from 'services/chat';

import User from 'types/User';
import { RecentChat } from 'types/Chat';

import { AppState } from 'store';
import { setActiveUserChat } from 'store/chat';

const getChatParticipant = (chat: RecentChat, userId: number) => {
	if (chat.from.id === userId) return chat.to;
	return chat.from;
}

const ContactsMessage = (): JSX.Element => {
	const activeChatUser = useSelector<AppState, User | null>(state => state.chat.activeUserChat);
	const authUserId = useSelector<AppState, number | undefined>(state => state.user.user?.id);
	const dispatch = useDispatch();
	const recentConversations = useSelector<AppState, RecentChat[]>(state => Object.values(state.chat.recentConversations));

	useEffect(() => {
		if (!authUserId) return;

		dispatch(getRecentConversations(authUserId))
	}, [ authUserId ])

	const selectUser = (user?: User) => {
		if (user) {
			dispatch(setActiveUserChat(user))
		}
	}

	return (
		<ul>
			{
				recentConversations.map((message, index) => (
					<div className="message-item" key={ index } onClick={ () => selectUser(getChatParticipant(message, authUserId!)) }>
						<div className="mr-2 mt-1">
							<Avatar/>
						</div>
						<div className="message-item-metadata">
							<div className="message-item-time">{ timeFromNow(message.created_at) }</div>
							<div className="message-item-contact">
								{ authUserId && getChatParticipant(message, authUserId).name }
							</div>
							<div className="message-item-chat">
								<p className="message-item-text">
								{ message.from.id === authUserId && 'You: ' }
								{ message.message.value }
								</p>
							</div>
						</div>
					</div>
				))
			}
		</ul>
	)
}

const Recent = (): JSX.Element => {
	return (
		<div className="message-container">
			<div className="search-wrapper">
				<div className="message-search">
					<i className="ri-search-2-line"></i>
					<input className="custom" type="text" placeholder="Search messages.." />
				</div>
			</div>
			<ContactsMessage />
		</div>
	)
}

export default Recent;