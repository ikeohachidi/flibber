import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '../ChatWindow.css';

import MessageList from '../MessageList/MessageList';

import { AppState } from 'store';
import { getConversationService } from 'services/chat';
import { chatId } from 'utils/chat';

import Chat from 'types/Chat'
import User from 'types/User';
import { CONVERSATION_TYPE } from 'types';

interface Props {
	authUser: User
}

const SingleChat = ({ authUser }: Props): JSX.Element => {
	const dispatch = useDispatch();

	const activeChatUser = useSelector<AppState, User>(state => state.chat.activeUserChat!);
	const loadedConversations = useSelector<AppState, {[userId: string]: true}>(state => state.chat.loadedConversations);
	const conversations = useSelector<AppState, Chat[]>(state => {
		if (activeChatUser.id in state.chat.conversation) {
			return state.chat.conversation[activeChatUser.id];
		}

		return [];
	});

	useEffect(() => {
		if (!(activeChatUser.id in loadedConversations)) {
			dispatch(getConversationService({
				chatId: chatId(authUser.id, activeChatUser.id),
				authUser: authUser.id,
				activeChatUser: activeChatUser.id
			}))
		}
 
	}, [ activeChatUser ])

	return <MessageList
		chatTitle={ activeChatUser.name }
		conversations={ conversations }
		authUser={ authUser }
		chatType={ CONVERSATION_TYPE.CHAT }
	></MessageList>;
}

export default SingleChat;